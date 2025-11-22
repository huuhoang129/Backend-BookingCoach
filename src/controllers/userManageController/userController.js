// src/controllers/userManageController/userController.js
import userServices from "../../services/userManageServices/userServices.js";

// Lấy tất cả người dùng
let getAllUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    return res.status(200).json(users);
  } catch (e) {
    console.error("Lỗi lấy danh sách người dùng:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy người dùng theo ID
let getUserById = async (req, res) => {
  try {
    const user = await userServices.getUserById(req.query.id);
    return res.status(200).json(user);
  } catch (e) {
    console.error("Lỗi lấy người dùng theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo người dùng mới
let createUser = async (req, res) => {
  try {
    const result = await userServices.createUser(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tạo người dùng:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật người dùng
let editUser = async (req, res) => {
  try {
    const result = await userServices.updateUser(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi cập nhật người dùng:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa người dùng
let deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    // Thiếu ID không thể xóa
    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số bắt buộc: id",
      });
    }

    const result = await userServices.deleteUser(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi xóa người dùng:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
};
