//src/middleware/auth/authorize.js
let authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ errCode: 1, message: "Chưa xác thực" });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        errCode: 2,
        message: `Bạn không có quyền truy cập (yêu cầu vai trò: ${roles.join(
          ", "
        )})`,
      });
    }

    next();
  };
};

export default authorize;
