import asyncHandler from "express-async-handler";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "../../models/Product.js";
import Sales from "../../models/Sales.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_LOW_STOCK_THRESHOLD = 5;
const DEFAULT_TOP_SALES_LIMIT = 5;
const MAX_TOP_SALES_LIMIT = 50;

const normalizeQuantity = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

// Non-negative finite number, or null if the input can't be safely coerced
// (empty string, non-numeric text, NaN, Infinity). Used to stop bad
// request bodies from silently writing NaN into ActualPrice/SalePrice.
const parseNonNegativeNumber = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return null;
    return parsed;
};

const notFound = (res, entity = "Resource") =>
    res.status(404).json({
        success: false,
        message: `${entity} not found.`,
    });

// Returns true and lets the caller proceed if `id` is a syntactically
// valid Mongo ObjectId. Otherwise sends a clean 400 and returns false, so
// route handlers don't fall through to Mongoose's CastError (which would
// otherwise surface as an ugly, unhandled 500).
const requireValidObjectId = (id, res) => {
    if (mongoose.Types.ObjectId.isValid(id)) return true;
    res.status(400).json({
        success: false,
        message: "Invalid id format.",
    });
    return false;
};

const buildLowStockNotifications = (products = [], threshold = DEFAULT_LOW_STOCK_THRESHOLD) =>
    products
        .filter((product) => Number(product?.Quantity ?? 0) <= threshold)
        .map((product) => ({
            type: "low_stock",
            message: `${product?.ProductName || "Product"} is running low. Only ${product?.Quantity ?? 0} unit(s) left.`,
            productId: product?._id?.toString(),
            quantity: Number(product?.Quantity ?? 0),
        }));

// Parses a 'yyyy-MM-dd' query param into a real Date at the start or end
// of that day. Returns null for missing/invalid input so callers can skip
// adding it to the match filter rather than accidentally matching nothing.
const parseDateBoundary = (value, endOfDay = false) => {
    if (!value || typeof value !== "string") return null;

    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) return null;

    if (endOfDay) {
        date.setUTCHours(23, 59, 59, 999);
    }

    return date;
};

export const GetProducts = asyncHandler(async (req, res) => {
    const filter = String(req.query.filter || "all").toLowerCase();
    const rawThreshold = Number(req.query.threshold ?? DEFAULT_LOW_STOCK_THRESHOLD);
    // Clamp to >= 0 — a negative threshold would make "low stock" match
    // nothing (or match everything under $lte, depending on data), which
    // is never a meaningful business rule here.
    const stockThreshold = Number.isFinite(rawThreshold) && rawThreshold >= 0 ? rawThreshold : DEFAULT_LOW_STOCK_THRESHOLD;

    const query = {};
    if (filter === "available") {
        query.Quantity = { $gt: stockThreshold };
    } else if (filter === "lowstock") {
        query.Quantity = { $lte: stockThreshold };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    const lowStockProducts = products.filter((product) => Number(product.Quantity ?? 0) <= stockThreshold);
    const availableProducts = products.filter((product) => Number(product.Quantity ?? 0) > stockThreshold);
    const notifications = buildLowStockNotifications(products, stockThreshold);

    res.status(200).json({
        success: true,
        message: notifications.length
            ? `You have ${notifications.length} low-stock notification(s).`
            : "All products are above the low-stock threshold.",
        count: products.length,
        threshold: stockThreshold,
        availableCount: availableProducts.length,
        lowStockCount: lowStockProducts.length,
        products,
        lowStockProducts,
        notifications,
    });
});

export const GetProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!requireValidObjectId(id, res)) return;

    const product = await Product.findById(id);
    if (!product) return notFound(res, "Product");

    res.status(200).json({
        success: true,
        product,
    });
});

// Aggregates sales records by product, ranked by units sold, optionally
// scoped to a date range. Powers the "Top Selling Products" widget.
//
// Query params:
//   limit      - max products to return (default 5, capped at 50)
//   startDate  - 'yyyy-MM-dd', inclusive lower bound on createdAt
//   endDate    - 'yyyy-MM-dd', inclusive upper bound on createdAt
//
// Response shape matches what the frontend already expects, plus img/sku
// enrichment for a nicer widget (falls back to undefined if the sale
// wasn't grouped by a real ProductId, e.g. legacy records with no
// ProductId — the frontend already treats a missing img as "no icon").
//
// Perf note: this aggregation filters/sorts on createdAt and groups on
// ProductId — make sure Sales has indexes on both, or this will do a
// full collection scan as your sales table grows.
export const GetTopSales = asyncHandler(async (req, res) => {
    const startDate = parseDateBoundary(
        req.query.startDate,
        false
    );

    const endDate = parseDateBoundary(
        req.query.endDate,
        true
    );

    if (startDate && endDate && startDate > endDate) {
        return res.status(400).json({
            success: false,
            message: "startDate must be before endDate.",
        });
    }

    const match = {};

    if (startDate || endDate) {
        match.createdAt = {};

        if (startDate) {
            match.createdAt.$gte = startDate;
        }

        if (endDate) {
            match.createdAt.$lte = endDate;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 1. Find ALL products ordered by quantity sold
    |--------------------------------------------------------------------------
    */

    const topSellingIds = await Sales.aggregate([
        ...(Object.keys(match).length
            ? [{ $match: match }]
            : []),

        {
            $match: {
                ProductId: {
                    $exists: true,
                    $ne: null,
                },
            },
        },

        {
            $group: {
                _id: "$ProductId",

                totalSold: {
                    $sum: {
                        $ifNull: ["$Quantity", 1],
                    },
                },
            },
        },

        // Highest selling product first
        {
            $sort: {
                totalSold: -1,
            },
        },
    ]);

    /*
    |--------------------------------------------------------------------------
    | 2. No sales found
    |--------------------------------------------------------------------------
    */

    if (!topSellingIds.length) {
        return res.status(200).json({
            success: true,
            message: "No sales recorded for the selected period.",
            count: 0,
            products: [],
        });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Get all Product IDs
    |--------------------------------------------------------------------------
    */

    const productIds = topSellingIds.map(
        (item) => item._id
    );

    /*
    |--------------------------------------------------------------------------
    | 4. Get the REAL Product documents
    |--------------------------------------------------------------------------
    */

    const products = await Product.find({
        _id: {
            $in: productIds,
        },
    }).lean();

    /*
    |--------------------------------------------------------------------------
    | 5. Create ranking information
    |--------------------------------------------------------------------------
    */

    const salesRank = new Map(
        topSellingIds.map((item, index) => [
            String(item._id),
            {
                rank: index + 1,
                totalSold: item.totalSold,
            },
        ])
    );

    /*
    |--------------------------------------------------------------------------
    | 6. Attach sales information to the real Product
    |--------------------------------------------------------------------------
    */

    const topProducts = products
        .map((product) => {
            const ranking = salesRank.get(
                String(product._id)
            );

            return {
                ...product,

                rank: ranking?.rank ?? null,

                totalSold: ranking?.totalSold ?? 0,
            };
        })

        /*
        |--------------------------------------------------------------------------
        | Keep the exact sales ranking
        |--------------------------------------------------------------------------
        */

        .sort((a, b) => a.rank - b.rank);

    /*
    |--------------------------------------------------------------------------
    | 7. Return ALL top-selling products
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
        success: true,

        message: `Found ${topProducts.length} top-selling product(s)${
            startDate || endDate
                ? " for the selected period"
                : ""
        }.`, 

        count: topProducts.length,

        products: topProducts,
    });
});

export const UpdateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!requireValidObjectId(id, res)) return;

    const product = await Product.findById(id);
    if (!product) return notFound(res, "Product");

    const { ProductName, ActualPrice, SalePrice, Quantity } = req.body;
    const img=req.file?.filename;
    if (ProductName !== undefined && ProductName !== null && String(ProductName).trim() !== "") {
        product.ProductName = String(ProductName).trim();
    }

    // BUG FIX: previously `Number(ActualPrice)` was assigned directly, so
    // a bad request body (e.g. ActualPrice: "abc") would silently store
    // NaN in the database. That NaN then poisons every downstream sum
    // that touches this product's price (sales totals, profit calcs).
    // Now invalid numeric input is rejected with a 400 instead of saved.
    if (ActualPrice !== undefined && ActualPrice !== null) {
        const nextActualPrice = parseNonNegativeNumber(ActualPrice);
        if (nextActualPrice === null) {
            return res.status(400).json({
                success: false,
                message: "ActualPrice must be a valid non-negative number.",
            });
        }
        product.ActualPrice = nextActualPrice;
    }

    if (SalePrice !== undefined && SalePrice !== null) {
        const nextSalePrice = parseNonNegativeNumber(SalePrice);
        if (nextSalePrice === null) {
            return res.status(400).json({
                success: false,
                message: "SalePrice must be a valid non-negative number.",
            });
        }
        product.SalePrice = nextSalePrice;
    }

    if (Quantity !== undefined && Quantity !== null) {
        const nextQuantity = normalizeQuantity(Quantity);
        if (nextQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a valid non-negative number.",
            });
        }
        product.Quantity = nextQuantity;
    }

    if(img){
        product.img = img;
    }

    await product.save();

    const notifications = buildLowStockNotifications([product], DEFAULT_LOW_STOCK_THRESHOLD);

    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product,
        notifications,
    });
});

export const DeleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!requireValidObjectId(id, res)) return;

    const product = await Product.findById(id);
    if (!product) return notFound(res, "Product");

    if (product.img) {
        // SECURITY FIX: path.join with an unsanitized product.img could
        // allow path traversal (e.g. img = "../../.env") if that field
        // was ever set from unvalidated input. path.basename() strips any
        // directory components, so this can only ever resolve to a file
        // directly inside the Img folder.
        const safeFileName = path.basename(product.img);
        try {
            await fsp.unlink(path.join(__dirname, "..", "..", "Public", "Img", safeFileName));
        } catch (error) {
            // Ignore missing image files and continue deleting the database record.
        }
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });
});

export default {
    GetProducts,
    GetProduct,
    GetTopSales,
    UpdateProduct,
    DeleteProduct,
};