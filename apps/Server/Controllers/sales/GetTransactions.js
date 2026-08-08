import asyncHandler from "express-async-handler";
import Sales from "../../models/Sales.js";

const normalizeDateValue = (value) => {
    if (!value) return null;
    const trimmed = String(value).trim();
    if (!trimmed) return null;
    const [year, month, day] = trimmed.split('-').map((part) => part.padStart(2, '0'));
    if (!year || !month || !day) return null;
    return `${year}-${month}-${day}`;
};

const buildDateQuery = (startDate, endDate) => {
    const normalizedStart = normalizeDateValue(startDate);
    const normalizedEnd = normalizeDateValue(endDate);

    if (normalizedStart && normalizedEnd) {
        return { Date: { $gte: normalizedStart, $lte: normalizedEnd } };
    }

    if (normalizedStart) {
        return { Date: { $gte: normalizedStart } };
    }

    if (normalizedEnd) {
        return { Date: { $lte: normalizedEnd } };
    }

    return {};
};

export const GetTransactions = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = buildDateQuery(req.query.startDate, req.query.endDate);

    const [transactions, totalCount] = await Promise.all([
        Sales.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
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
