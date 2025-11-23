//src/middleware/auth/authenticate.js
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({
      errCode: 1,
      message: "Thiếu token đăng nhập",
    });

  const token = authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      errCode: 1,
      message: "Token không hợp lệ",
    });

  jwt.verify(token, process.env.JWT_SECRET || "phu2000", (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          errCode: 2,
          message: "Token đã hết hạn",
        });
      }
      return res.status(403).json({
        errCode: 3,
        message: "Token không hợp lệ",
      });
    }

    req.user = decoded;
    next();
  });
};

export default authenticate;
