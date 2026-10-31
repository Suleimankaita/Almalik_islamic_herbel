import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    CustomerName: {
      type: String,
      required: true,
      trim: true,
    },
    Phone: {
      type: String,
      trim: true,
      default: "",
    },
    Details: {
      type: String,
      trim: true,
      default: "",
    },
    Type: {
      type: String,
      enum: ["product", "money"],
      required: true,
    },
    Product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlmalikProduct",
    },
    ItemName: {
      type: String,
      trim: true,
      default: "",
    },
    Quantity: {
      type: Number,
      min: 1,
    },
    Amount: {
      type: Number,
      min: 0,
      required: true,
    },
    CollectedDate: {
      type: String,
      required: true,
    },
    DueDate: {
      type: String,
      default: "",
    },
    PaidDate: {
      type: String,
      default: "",
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlmalikUser",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AlmalikLoan", LoanSchema);
