import mongoose from "mongoose";

const Userschema = new mongoose.Schema(
  {
    FirtsName: String,
    LastName: String,
    Username:{
      type: String,
      unique: true},
    UserProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlmalikUserProfiles",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AlmalikUser", Userschema);
