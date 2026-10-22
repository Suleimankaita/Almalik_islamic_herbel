import express from "express";
import { CreateProduct } from "../controllers/products/Products.js";
import {
    GetProducts,
    GetLowStockProducts,
    GetProduct,
    UpdateProduct,
    GetTopSales,
    DeleteProduct,
    SetProductStatus,
} from "../controllers/products/GetProducts.js";
import Verify from "../Middleware/Verify.js";
import RequireRole from "../Middleware/RequireRole.js";
const router = express.Router();

router.post("/", Verify, RequireRole("Admin", "Manager"), CreateProduct);
router.get("/", Verify,GetProducts);
router.get("/low-stock", Verify, GetLowStockProducts);
router.get("/TopSelling", Verify,GetTopSales);
router.get("/:id", Verify, GetProduct);
router.put("/:id", Verify, RequireRole("Admin", "Manager"), UpdateProduct);
router.patch("/:id/status", Verify, RequireRole("Admin", "Manager"), SetProductStatus);
router.delete("/:id", Verify, RequireRole("Admin"), DeleteProduct);

export default router;