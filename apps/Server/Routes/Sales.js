import express from "express";
import Sales from "../Controllers/sales/Sales.js";
import verify from "../Middleware/Verify.js"
const router = express.Router();

router.route('/Sales')
.post(verify,Sales);

export default router;