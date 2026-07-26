import asyncHandler from "express-async-handler";
import Product from "../../models/Product.js";
import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import fsp from "fs/promises"
// Create Product
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CreateProduct = asyncHandler(async (req, res) => {
    const {
        ProductName,
        ActualPrice,
        SalePrice
    } = req.body;
    const img=req.file?.filename
    console.log(img)
    const checkInput = Checkfields({
        ProductName,
        ActualPrice,
        SalePrice,
        img
    });

    if (!checkInput.success) {
        return res.status(400).json({
            success: false,
            message: checkInput.message,
        });
    }

    const productExist = await Product.findOne({
        ProductName: ProductName.trim(),
    });

    if (productExist) {
        return res.status(400).json({
            success: false,
            message: "Product already exists.",
        });
    }

    const product = await Product.create({
        ProductName: ProductName.trim(),
        ActualPrice,
        SalePrice,
        img
    });

    res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product,
    });
});

// Get All Products
export const GetProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: products.length,
        products,
    });
});

// Get Single Product
export const GetProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Update Product
export const UpdateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        ProductName,
        ActualPrice,
        SalePrice,
    } = req.body;
    
    const img=req.file?.filename
    const product = await Product.findById(id);
    console.log(img)

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    product.ProductName = ProductName ?? product.ProductName;
    product.ActualPrice = ActualPrice ?? product.ActualPrice;
    product.SalePrice = SalePrice ?? product.SalePrice;
    product.img=img??product.img
    if(img&&product.img){
        await fsp.unlink(path.join(__dirname,"..","..","Public/Img",product?.img))
    }
    await product.save();

    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product,
    });
});

// Delete Product
export const DeleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }
        await fsp.unlink(path.join(__dirname,"..","..","Public/Img",product?.img))
    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });
});