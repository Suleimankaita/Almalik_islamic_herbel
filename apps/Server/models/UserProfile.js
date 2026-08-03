import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    Password: String,
   
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
