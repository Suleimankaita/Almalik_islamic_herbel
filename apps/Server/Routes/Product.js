import express from "express";
import {
    CreateProduct,
    GetProducts,
    GetProduct,
    UpdateProduct,
    DeleteProduct,
} from "../controllers/products/Products.js";

const router = express.Router();

router.post("/", CreateProduct);
router.get("/", GetProducts);
router.get("/:id", GetProduct);
router.put("/:id", UpdateProduct);
router.delete("/:id", DeleteProduct);

export default router;