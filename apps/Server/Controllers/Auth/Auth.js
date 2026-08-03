import User from "../../models/User.js";
import asynchandler from "express-async-handler";
import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import jwt from "jsonwebtoken";
import UserActivity from "../../models/UserActivity.js";

const Login = asynchandler(async (req, res) => {
  const { Username, Password } = req.body;
  const checklist = Checkfields({ Username, Password });

  if (!checklist.success) {
    return res.status(400).json({ message: checklist.message || "Username and password are required" });
  }

  const userFound = await User.findOne({ Username }).populate("UserProfile").exec();

  if (!userFound?.UserProfile) {
    return res.status(401).json({ message: `User not found: ${Username}` });
  }

  if (String(userFound.UserProfile.Password).toLowerCase() !== String(Password).toLowerCase()) {
    return res.status(400).json({ message: "Incorrect Username or Password" });
  }

      const Activityid=await UserActivity.create({
        Username:userFound.Username,
          ActivtyType:"Login"
          })  
      userFound.UserProfile?.Logs.push(Activityid);
      await userFound.save()
    
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "dev-access-token";
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token";

  const accessToken = jwt.sign(
    {
      UserInfo: {
        Username: userFound.Username,
        Role: userFound.UserProfile.Role,
        id: userFound._id,
      },
    },
    accessTokenSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      UserInfo: {
        Username: userFound.Username,
        Role: userFound.UserProfile.Role,
        id: userFound._id,
      },
    },
    refreshTokenSecret,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    accessToken,
    user: {
      Username: userFound.Username,
      Role: userFound.UserProfile.Role,
    },
  });
});

export default Login;
