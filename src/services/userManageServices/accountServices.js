import db from "../../models/index.js";

let getAllAccounts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        attributes: ["id", "email", "role", "status"], // ✅ thêm id, status
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Khóa tài khoản (status = Looking)
let lockAccount = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: false });

      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "User not found!",
        });
      }

      user.status = "Locking";
      await user.save();

      return resolve({
        errCode: 0,
        errMessage: "Account locked successfully!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Mở tài khoản (status = Active)
let unlockAccount = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: false });

      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "User not found!",
        });
      }

      user.status = "Active"; // 👈 trạng thái mở
      await user.save();

      return resolve({
        errCode: 0,
        errMessage: "Account unlocked successfully!",
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
