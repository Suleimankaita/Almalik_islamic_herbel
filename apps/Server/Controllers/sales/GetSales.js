import asynchandler from "express-async-handler";
import Sales from "../../models/Sales.js";
import User from "../../models/User.js";

const GetSalesUserSales = asynchandler(async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      const sales = await Sales.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: sales.length, sales });
    }

    const userFound = await User.findById(userId).populate({
      path: "UserProfile",
      populate: {
        path: "Sales",
        path: "Logs",
      },
    });

    const saleIds = userFound?.UserProfile?.Sales?.map((sale) => sale._id) || [];

    const sales = saleIds.length
      ? await Sales.find({ _id: { $in: saleIds } }).sort({ createdAt: -1 })
      : [];

    return res.status(200).json({ success: true, count: sales.length, sales });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default GetSalesUserSales;
