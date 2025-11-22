// src/controllers/userManageController/authController.js
import authService from "../../services/userManageServices/authServices.js";

// Đăng nhập người dùng
let loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Kiểm tra thiếu dữ liệu
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Thiếu thông tin bắt buộc",
    });
  }

  const userData = await authService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    user: userData.user || {},
  });
};

// Đăng ký người dùng
let registerUser = async (req, res) => {
  try {
    const result = await authService.handleUserRegister(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi đăng ký tài khoản:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Quên mật khẩu
let forgotPassword = async (req, res) => {
  const { email } = req.body;

  const result = await authService.handleForgotPassword(email);
  return res.status(200).json(result);
};

// Đặt lại mật khẩu
let resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Kiểm tra thiếu dữ liệu
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Thiếu thông tin bắt buộc",
    });
  }

  const result = await authService.handleResetPassword(email, otp, newPassword);
  return res.status(200).json(result);
};

export default {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
};
