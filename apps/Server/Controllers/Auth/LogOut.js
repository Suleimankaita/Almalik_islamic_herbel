import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";
import User from "../../models/User.js";
import UserActivity from "../../models/UserActivity.js";
import authCookieOptions from "../../Config/AuthCookie.js";

const LogOut = asynchandler(async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  let userId;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token",
      );
      userId = decoded?.UserInfo?.id;
    } catch {
      // A missing or expired refresh token should not prevent cookie cleanup.
    }
  }

  res.clearCookie("jwt", authCookieOptions());

  if (userId) {
    try {
      const user = await User.findById(userId).populate("UserProfile");
      if (user) {
        const activity = await UserActivity.create({
          Username: user.Username,
          ActivtyType: "LogOut",
        });
        user.UserProfile?.Logs.push(activity);
        await user.save();
      }
    } catch (error) {
      console.error("Unable to record logout activity.", error);
    }
  }

  return res.status(200).json({ message: "You logged out successfully." });
});

export default LogOut;