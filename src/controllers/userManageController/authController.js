import authService from "../../services/userManageServices/authServices";

let loginUser = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await authService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let registerUser = async (req, res) => {
  console.log("req.body:", req.body);
  let message = await authService.handleUserRegister(req.body);
  return res.status(200).json(message);
};

let forgotPassword = async (req, res) => {
  let { email } = req.body;
  let result = await authService.handleForgotPassword(email);
  return res.status(200).json(result);
};

let resetPassword = async (req, res) => {
  console.log("🔍 [Controller] ResetPassword body:", req.body);

  let { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing parameter!",
    });
  }

  let result = await authService.handleResetPassword(email, otp, newPassword);
  return res.status(200).json(result);
};

module.exports = {
  loginUser: loginUser,
  registerUser: registerUser,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
};
