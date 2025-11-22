// src/services/userManageServices/accountServices.js
import db from "../../models/index.js";

// Lấy danh sách toàn bộ tài khoản
let getAllAccounts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy các thông tin cần thiết của user
      let users = await db.User.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "createdAt",
        ],
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách tài khoản thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Khóa tài khoản (status = Locking)
let lockAccount = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo ID
      let user = await db.User.findOne({ where: { id: userId }, raw: false });

      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "Không tìm thấy người dùng",
        });
      }

      // Cập nhật trạng thái khóa
      user.status = "Locking";
      await user.save();

      return resolve({
        errCode: 0,
        errMessage: "Khóa tài khoản thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Mở khóa tài khoản (status = Active)
let unlockAccount = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo ID
      let user = await db.User.findOne({ where: { id: userId }, raw: false });

      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "Không tìm thấy người dùng",
        });
      }

      // Cập nhật trạng thái mở khóa
      user.status = "Active";
      await user.save();

      return resolve({
        errCode: 0,
        errMessage: "Mở khóa tài khoản thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllAccounts,
  lockAccount,
  unlockAccount,
};
