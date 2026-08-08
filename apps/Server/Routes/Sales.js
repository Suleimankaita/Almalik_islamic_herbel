import express from "express";
import CreateSale from "../Controllers/sales/Sales.js";
import GetSales from "../Controllers/sales/GetSales.js";
import { GetTransactions, GetTopSales } from "../Controllers/sales/GetTransactions.js";
import verify from "../Middleware/Verify.js";

const router = express.Router();

router.route("/sales")
  .get(verify, GetSales)
  .post(verify, CreateSale);

router.get("/transactions", verify, GetTransactions);
router.get("/top-sales", verify, GetTopSales);

export default router;