// src/services/userManageServices/driverServices.js
import db from "../../models/index.js";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

// Hash mật khẩu người dùng
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy danh sách tất cả khách hàng (role = Client)
let getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAll({
        where: { role: "Client" },
        attributes: { exclude: ["password"] },
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách khách hàng thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy thông tin khách hàng theo ID
let getUserById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Thiếu id
      if (!inputId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số userId",
        });
      }

      const user = await db.User.findOne({
        where: { id: inputId, role: "Client" },
        attributes: { exclude: ["password"] },
        raw: true,
      });

      if (!user) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy người dùng",
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "Lấy thông tin khách hàng thành công",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Sinh mã người dùng theo role (Client/Employee)
function generateUserCode(role, id) {
  if (role === "Client") return `KH${String(id).padStart(4, "0")}`;
  return `EMP${String(id).padStart(4, "0")}`;
}

// Tạo mới khách hàng (Client)
let createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate các trường bắt buộc
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu các trường bắt buộc",
        });
      }

      // Kiểm tra email đã tồn tại
      const existingUser = await db.User.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        return resolve({
          errCode: 2,
          errMessage: "Email đã tồn tại trong hệ thống",
        });
      }

      const hashPassword = await hashUserPassword(data.password);

      // Tạo user mới với role Client
      const newUser = await db.User.create({
        email: data.email,
        password: hashPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: "Client",
        status: "Active",
      });

      // Sinh mã khách hàng
      const userCode = generateUserCode(newUser.role, newUser.id);
      newUser.userCode = userCode;
      await newUser.save();

      resolve({
        errCode: 0,
        errMessage: "Tạo khách hàng thành công",
        data: newUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin khách hàng
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Bắt buộc phải có id
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số id",
        });
      }

      const user = await db.User.findOne({
        where: { id: data.id, role: "Client" },
        raw: false,
      });

      if (!user) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy người dùng",
        });
      }

      // Cập nhật thông tin cơ bản
      user.email = data.email || user.email;
      user.firstName = data.firstName || user.firstName;
      user.lastName = data.lastName || user.lastName;
      user.phoneNumber = data.phoneNumber || user.phoneNumber;

      await user.save();

      resolve({
        errCode: 0,
        errMessage: "Cập nhật khách hàng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa khách hàng (chỉ xóa role = Client)
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundUser = await db.User.findOne({
        where: { id: userId, role: "Client" },
      });

      if (!foundUser) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy người dùng",
        });
      }

      await db.User.destroy({ where: { id: userId } });

      resolve({
        errCode: 0,
        errMessage: "Xóa khách hàng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
