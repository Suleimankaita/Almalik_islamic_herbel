import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import UserProfile from "../../models/UserProfile.js";
import Checkfields from "../../../../packages/utils/FieldCheck.ts";

const ALLOWED_THEMES = ["light", "dark"];
const ALLOWED_LANGUAGES = ["English", "French", "Arabic", "Spanish"];
const ALLOWED_UNITS = ["Metric (kg, cm)", "Imperial (lb, in)"];

const notFound = (res, entity = "Resource") =>
  res.status(404).json({
    success: false,
    message: `${entity} not found.`,
  });

export const GetUserSettings = asyncHandler(async (req, res) => {
  const userId = req.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized." });

  const user = await User.findById(userId).populate("UserProfile").lean().exec();
  if (!user) return notFound(res, "User");

  const profile = user.UserProfile || {};

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      Username: user.Username,
      Role: profile.Role || "Staff",
      Email: profile.Email || "",
      Notifications: profile.Notifications !== undefined ? profile.Notifications : true,
      Theme: profile.Theme || "light",
      Language: profile.Language || "English",
      Units: profile.Units || "Metric (kg, cm)",
    },
  });
});

export const UpdateUserSettings = asyncHandler(async (req, res) => {
  const userId = req.id;
  const img=req.file?.filename;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized." });

  const { Email, Notifications, Theme, Language, Units } = req.body;
  const user = await User.findById(userId).populate("UserProfile").exec();
  if (!user) return notFound(res, "User");
  const profile = user.UserProfile;
  if (!profile) {
    return res.status(500).json({ success: false, message: "User profile is missing." });
  }

  if (Email !== undefined) {
    const emailCheck = Checkfields({ Email });
    if (!emailCheck.success) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    profile.Email = String(Email).trim();
  }

  if (Notifications !== undefined) {
    profile.Notifications = Notifications === "false" || Notifications === false ? false : true;
  }

  if (Theme !== undefined) {
    if (!ALLOWED_THEMES.includes(String(Theme))) {
      return res.status(400).json({ success: false, message: "Invalid theme selection." });
    }
    profile.Theme = String(Theme);
  }

  if (Language !== undefined) {
    if (!ALLOWED_LANGUAGES.includes(String(Language))) {
      return res.status(400).json({ success: false, message: "Invalid language selection." });
    }
    profile.Language = String(Language);
  }

  if (Units !== undefined) {
    if (!ALLOWED_UNITS.includes(String(Units))) {
      return res.status(400).json({ success: false, message: "Invalid units selection." });
    }
    profile.Units = String(Units);
  }
  if(img){
    user.UserProfile.img=img
  }

  await profile.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully.",
    user: {
      id: user._id,
      Username: user.Username,
      Role: profile.Role,
      Email: profile.Email,
      Notifications: profile.Notifications,
      Theme: profile.Theme,
      Language: profile.Language,
      Units: profile.Units,
    },
  });
});

export const ChangeUserPassword = asyncHandler(async (req, res) => {
  const userId = req.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized." });

  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 6) {
    return res.status(400).json({
      success: false,
      message: "A valid new password with at least 6 characters is required.",
    });
  }

  const user = await User.findById(userId).populate("UserProfile").exec();
  if (!user) return notFound(res, "User");
  const profile = user.UserProfile;
  if (!profile) {
    return res.status(500).json({ success: false, message: "User profile is missing." });
  }

  profile.Password = String(newPassword);
  await profile.save();

  res.status(200).json({ success: true, message: "Password updated successfully." });
});

export const DeleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized." });

  const user = await User.findById(userId).exec();
  if (!user) return notFound(res, "User");

  const profileId = user.UserProfile;
  await user.deleteOne();
  if (profileId) {
    await UserProfile.findByIdAndDelete(profileId).exec();
  }

  res.status(200).json({ success: true, message: "Account deleted successfully." });
});

export default {
  GetUserSettings,
  UpdateUserSettings,
  ChangeUserPassword,
  DeleteUserAccount,
};