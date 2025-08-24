import userService from "../services/userServices";

let handleRegister = async (req, res) => {
  let data = req.body;

  if (
    !data.email ||
    !data.password ||
    !data.firstName ||
    !data.lastName ||
    !data.numberPhone
  ) {
    return res.status(400).json({
      errCode: 1,
      message: `Missing required parameters: ${missing.join(", ")}`,
    });
  }

  let message = await userService.handleUserRegister(req.body);
  return res.status(200).json(message);
};

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

module.exports = {
  handleRegister,
  handleLogin,
};
