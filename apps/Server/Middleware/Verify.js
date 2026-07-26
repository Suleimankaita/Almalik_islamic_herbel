import asynchandler from "express-async-handler";
import jwt from "jsonwebtoken";

const Verify = asynchandler(async (req, res, next) => {
  const auth = req.headers["authorization"] || req.headers["Authorization"];

  if (!auth || typeof auth !== "string" || !auth.startsWith("Bearer ")) {
    req.id = null;
    return next();
  }

  try {
    const token = auth.split(" ")[1];
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "dev-access-token");
    const { Username, Role, id } = decode.UserInfo || {};

    req.Username = Username;
    req.id = id;
    req.Roles = Role;
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Authorized token" });
  }
});

export default Verify;