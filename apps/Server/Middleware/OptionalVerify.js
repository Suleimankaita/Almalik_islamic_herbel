import jwt from "jsonwebtoken";

const OptionalVerify = (req, res, next) => {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (!auth) return next();
  if (typeof auth !== "string" || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Invalid authorization header." });
  }

  try {
    const token = auth.slice("Bearer ".length);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "dev-access-token");
    const userInfo = decoded?.UserInfo;
    if (!userInfo?.id || !userInfo?.Role) {
      return res.status(403).json({ success: false, message: "Invalid authorization token." });
    }
    req.Username = userInfo.Username;
    req.id = userInfo.id;
    req.Roles = userInfo.Role;
    return next();
  } catch {
    return res.status(403).json({ success: false, message: "Invalid authorization token." });
  }
};

export default OptionalVerify;
