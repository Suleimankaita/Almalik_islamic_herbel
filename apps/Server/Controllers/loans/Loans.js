import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Loan from "../../models/Loan.js";
import Product from "../../models/Product.js";

const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

class InsufficientLoanStockError extends Error {}

export const GetLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ CreatedBy: req.id }).sort({ createdAt: -1 }).lean().exec();
  res.status(200).json({ success: true, loans });
});

export const CreateLoan = asyncHandler(async (req, res) => {
  const { customerName, phone = "", details = "", type, productId, quantity, items, amount, collectedDate, dueDate } = req.body || {};

  if (typeof customerName !== "string" || !customerName.trim()) {
    return res.status(400).json({ success: false, message: "Customer name is required." });
  }
  if (typeof phone !== "string") {
    return res.status(400).json({ success: false, message: "Phone must be text." });
  }
  if (typeof details !== "string") {
    return res.status(400).json({ success: false, message: "Customer details must be text." });
  }
  if (!["product", "money"].includes(type)) {
    return res.status(400).json({ success: false, message: "Choose a product or money loan." });
  }
  if (!isValidDate(collectedDate)) {
    return res.status(400).json({ success: false, message: "Enter a valid collection date." });
  }
  if (!isValidDate(dueDate) || dueDate < collectedDate) {
    return res.status(400).json({ success: false, message: "Enter a valid due date on or after the collection date." });
  }

  let loanData = {
    CustomerName: customerName.trim(),
    Phone: phone.trim(),
    Details: details.trim(),
    Type: type,
    CollectedDate: collectedDate,
    DueDate: dueDate,
    CreatedBy: req.id,
  };
  if (type === "product" && Array.isArray(items)) {
    if (!items.length) {
      return res.status(400).json({ success: false, message: "Add at least one product to the loan." });
    }

    const loanItems = items.map((item) => ({
      id: String(item?.id || ""),
      quantity: Number(item?.quantity),
    }));
    const productIds = loanItems.map((item) => item.id);
    if (loanItems.some((item) => !mongoose.isValidObjectId(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return res.status(400).json({ success: false, message: "Each loan item needs a product and a positive whole-number quantity." });
    }
    if (new Set(productIds).size !== productIds.length) {
      return res.status(400).json({ success: false, message: "Each product may only appear once in a loan." });
    }

    const products = await Product.find({ _id: { $in: productIds } }).exec();
    const productById = new Map(products.map((product) => [product._id.toString(), product]));
    if (products.length !== productIds.length) {
      return res.status(404).json({ success: false, message: "One or more products were not found." });
    }

    const deducted = [];
    try {
      const loansToCreate = [];
      for (const item of loanItems) {
        const product = productById.get(item.id);
        if (!product) {
          throw new Error("Product not found.");
        }

        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.id, Quantity: { $gte: item.quantity } },
          { $inc: { Quantity: -item.quantity } },
          { new: true }
        ).exec();
        if (!updatedProduct) {
          throw new InsufficientLoanStockError(`${product.ProductName} has only ${product.Quantity} item(s) remaining.`);
        }
        deducted.push({ id: item.id, quantity: item.quantity });
        loansToCreate.push({
          _id: new mongoose.Types.ObjectId(),
          ...loanData,
          Product: product._id,
          ItemName: product.ProductName,
          Quantity: item.quantity,
          Amount: Number(product.SalePrice || 0) * item.quantity,
        });
      }

      const loans = await Loan.insertMany(loansToCreate);
      return res.status(201).json({ success: true, message: "Loan recorded successfully.", loans });
    } catch (error) {
      await Promise.all([
        Loan.deleteMany({ _id: { $in: loansToCreate.map((loan) => loan._id) } }).exec(),
        ...deducted.map(({ id, quantity }) =>
          Product.updateOne({ _id: id }, { $inc: { Quantity: quantity } }).exec()
        ),
      ]);
      if (error instanceof InsufficientLoanStockError) {
        return res.status(400).json({ success: false, message: error.message });
      }
      throw error;
    }
  }

  let inventoryProduct;

  if (type === "product") {
    const requestedQuantity = Number(quantity);
    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Choose a product and a positive whole-number quantity." });
    }

    inventoryProduct = await Product.findById(productId).exec();
    if (!inventoryProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, Quantity: { $gte: requestedQuantity } },
      { $inc: { Quantity: -requestedQuantity } },
      { new: true }
    ).exec();
    if (!updatedProduct) {
      return res.status(400).json({
        success: false,
        message: `${inventoryProduct.ProductName} has only ${inventoryProduct.Quantity} item(s) remaining.`,
      });
    }

    loanData = {
      ...loanData,
      Product: inventoryProduct._id,
      ItemName: inventoryProduct.ProductName,
      Quantity: requestedQuantity,
      Amount: Number(inventoryProduct.SalePrice || 0) * requestedQuantity,
    };

    const loanId = new mongoose.Types.ObjectId();
    try {
      const loan = await Loan.create({ ...loanData, _id: loanId });
      return res.status(201).json({ success: true, message: "Loan recorded successfully.", loan });
    } catch (error) {
      await Promise.all([
        Loan.deleteOne({ _id: loanId }).exec(),
        Product.updateOne({ _id: inventoryProduct._id }, { $inc: { Quantity: requestedQuantity } }).exec(),
      ]);
      throw error;
    }
  }

  const requestedAmount = Number(amount);
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    return res.status(400).json({ success: false, message: "Enter an amount greater than zero." });
  }

  const loan = await Loan.create({ ...loanData, Amount: requestedAmount });
  return res.status(201).json({ success: true, message: "Loan recorded successfully.", loan });
});

export const UpdateLoanPayment = asyncHandler(async (req, res) => {
  const { paidDate } = req.body;
  if (paidDate !== "" && !isValidDate(paidDate)) {
    return res.status(400).json({ success: false, message: "Enter a valid payment date." });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Loan not found." });
  }
  const loan = await Loan.findOne({ _id: req.params.id, CreatedBy: req.id }).exec();
  if (!loan) {
    return res.status(404).json({ success: false, message: "Loan not found." });
  }
  if (paidDate && paidDate < loan.CollectedDate) {
    return res.status(400).json({ success: false, message: "Payment date cannot be before the collection date." });
  }

  loan.PaidDate = paidDate;
  await loan.save();
  res.status(200).json({ success: true, message: "Payment date updated.", loan });
});
