// src/controllers/userManageController/accountController.js
import accountServices from "../../services/userManageServices/accountServices.js";

// Lấy tất cả tài khoản
let getAllAccounts = async (req, res) => {
  try {
    const result = await accountServices.getAllAccounts();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy danh sách tài khoản:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Khóa tài khoản
let lockAccount = async (req, res) => {
  try {
    const { id } = req.body;

    // Thiếu tham số id → không xử lý
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Thiếu tham số bắt buộc: id",
      });
    }

    const result = await accountServices.lockAccount(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khóa tài khoản:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Mở khóa tài khoản người dùng
let unlockAccount = async (req, res) => {
  try {
    const { id } = req.body;

    // Thiếu tham số id → không xử lý
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Thiếu tham số bắt buộc: id",
      });
    }

    const result = await accountServices.unlockAccount(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi mở khóa tài khoản:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllAccounts,
  lockAccount,
  unlockAccount,
};
