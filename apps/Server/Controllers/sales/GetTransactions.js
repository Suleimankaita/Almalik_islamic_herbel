import asyncHandler from "express-async-handler";
import Sales from "../../models/Sales.js";

const normalizeDateValue = (value) => {
    if (!value) return null;
    const trimmed = String(value).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
    const date = new Date(`${trimmed}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== trimmed ? null : trimmed;
};

const buildDateQuery = (startDate, endDate) => {
    const normalizedStart = normalizeDateValue(startDate);
    const normalizedEnd = normalizeDateValue(endDate);
    const createdAt = {};

    if (normalizedStart) {
        createdAt.$gte = new Date(`${normalizedStart}T00:00:00.000Z`);
    }

    if (normalizedEnd) {
        const dayAfterEnd = new Date(`${normalizedEnd}T00:00:00.000Z`);
        dayAfterEnd.setUTCDate(dayAfterEnd.getUTCDate() + 1);
        createdAt.$lt = dayAfterEnd;
    }

    return Object.keys(createdAt).length ? { createdAt } : {};
};

const escapeRegExp = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const GetTransactions = asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const query = buildDateQuery(req.query.startDate, req.query.endDate);

    const productName = String(req.query.productName || '').trim();
    if (productName) {
        query.ProductName = {
            $regex: new RegExp(`^${escapeRegExp(productName)}`, 'i'),
        };
    }

    const [transactions, totalCount] = await Promise.all([
        Sales.find(query)
            .populate("User", "Username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Sales.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        page,
        limit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        count: transactions.length,
        transactions,
    });
});

export const GetTopSales = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const query = buildDateQuery(req.query.startDate, req.query.endDate);

    const topSales = await Sales.aggregate([
        {
            $match: query,
        },
        {
            $group: {
                _id: "$ProductName",
                productName: { $first: "$ProductName" },
                totalSold: { $sum: "$Quantity" },
                totalRevenue: {
                    $sum: {
                        $multiply: ["$SalePrice", "$Quantity"],
                    },
                },
                transactionCount: { $sum: 1 },
            },
        },
        {
            $sort: {
                totalSold: -1,
                totalRevenue: -1,
            },
        },
        {
            $limit: limit,
        },
    ]);

    res.status(200).json({
        success: true,
        count: topSales.length,
        topSales,
    });
});

export default GetTransactions;
