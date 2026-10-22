import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    Password: String,
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    Notifications: {
      type: Boolean,
      default: true,
    },
    LowStockThreshold: {
      type: Number,
      min: 0,
      default: 5,
    },
    Theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    Language: {
      type: String,
      enum: ["English", "French", "Arabic", "Spanish"],
      default: "English",
    },
    Units: {
      type: String,
      enum: ["Metric (kg, cm)", "Imperial (lb, in)"],
      default: "Metric (kg, cm)",
    },
    img: String,
    Role: {
      enum: ["Admin", "Manager", "Staff"],
      type: String,
      default: "Staff",
    },
    
    Sales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AlmalikUserSales",
      },
    ],
    Logs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AlmalikUserLogs",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AlmalikUserProfiles", UserProfileSchema);
