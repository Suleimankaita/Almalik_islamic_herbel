import express from "express";
import GetSales from "../Controllers/sales/GetAllsalesUsers.js";
import verify from "../Middleware/Verify.js";

const router = express.Router();

router.route("/sales/users").get(verify, GetSales);

export default router;