import Sales from "../../models/Sales.js";
import User from "../../models/User.js";
import asyncHandler from "express-async-handler";
import Product from "../../models/Product.js";
import UserActivity from "../../models/UserActivity.js";

const Sale = asyncHandler(async (req, res) => {
  const userId = req.id;
  const items = req.body?.items;
  const requestedPaymentMethod = req.body?.paymentMethod || "cash";
  const paymentMethods = ["cash", "card", "pos"];

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Add at least one product to the sale." });
  }

  if (!paymentMethods.includes(requestedPaymentMethod)) {
    return res.status(400).json({ message: "Select a valid payment method." });
  }

  const saleItems = items.map((item) => ({
    id: String(item?.id || ""),
    quantity: Number(item?.quantity ?? item?.Quantity),
  }));
  const productIds = saleItems.map((item) => item.id);

  if (saleItems.some((item) => !item.id || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return res.status(400).json({ message: "Each sale item needs a product ID and a positive whole-number quantity." });
  }

  if (new Set(productIds).size !== productIds.length) {
    return res.status(400).json({ message: "Each product may only appear once in a sale." });
  }

  const userFound = await User.findById(userId).populate("UserProfile");
  if (!userFound?.UserProfile) {
    return res.status(404).json({ message: "Cashier profile could not be found." });
  }

  const foundProducts = await Product.find({ _id: { $in: productIds } });
  const productById = new Map(foundProducts.map((product) => [product._id.toString(), product]));

  if (foundProducts.length !== productIds.length) {
    return res.status(404).json({ message: "One or more products were not found." });
  }

  for (const item of saleItems) {
    const product = productById.get(item.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (item.quantity > product.Quantity) {
      return res.status(400).json({
        message: `${product.ProductName} has only ${product.Quantity} item(s) remaining.`,
      });
    }
  }

  let total = 0;
  const sales = [];

  for (const item of saleItems) {
    const product = productById.get(item.id);
    if (!product) continue;

    const sale = await Sales.create({
      ProductName: product.ProductName,
      SKU: product.SKU,
      Barcode: product.Barcode,
      User: userFound._id,
      SalePrice: product.SalePrice,
      ActualPrice: product.ActualPrice,
      Quantity: item.quantity,
      PaymentMethod: requestedPaymentMethod,
    });

    product.Quantity -= item.quantity;
    await product.save();

    userFound.UserProfile.Sales.push(sale._id);
    sales.push(sale);
    total += product.SalePrice * item.quantity;
  }

  const activity = await UserActivity.create({
    Username: userFound.Username,
    ActivtyType: "Sale",
    ItemId: productIds,
  });
  userFound.UserProfile.Logs.push(activity._id);
  await userFound.UserProfile.save();

  return res.status(200).json({
    message: "Sale completed successfully",
    total,
    count: sales.length,
    sales,
  });
});

export default Sale
