//src/middleware/auth/authenticate.js
import jwt from "jsonwebtoken";

let authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ errCode: 1, message: "Thiếu token đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "phu2000");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ errCode: 2, message: "Token đã hết hạn" });
    }
    return res.status(403).json({ errCode: 3, message: "Token không hợp lệ" });
  }
};

export default authenticate;
