import express from "express";
import { CreateProduct } from "../controllers/products/Products.js";
import {
    GetProducts,
    GetProduct,
    UpdateProduct,
    GetTopSales,
    DeleteProduct,
} from "../controllers/products/GetProducts.js";
import Verify from "../Middleware/Verify.js";
const router = express.Router();

router.post("/",Verify, CreateProduct);
router.get("/", Verify,GetProducts);
router.get("/TopSelling", Verify,GetTopSales);
router.get("/:id", Verify, GetProduct);
router.put("/:id", Verify, UpdateProduct);
router.delete("/:id", Verify, DeleteProduct);

export default router;