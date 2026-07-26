import asynchandler from "express-async-handler";
import Sales from "../../models/Sales.js";

const GetSalesUserSales = asynchandler(async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate({
        path: "User",
        select: "Username FirtsName LastName UserProfile",
        populate: {
          path: "UserProfile",
          select: "Role",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: sales.length, sales });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default GetSalesUserSales;
