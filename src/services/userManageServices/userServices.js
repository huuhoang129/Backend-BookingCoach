import db from "../../models/index.js";

let getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        where: { role: "Client" }, // 👈 lọc theo role
        attributes: { exclude: ["password"] },
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

let getUserById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: inputId, role: "Client" }, // 👈 chỉ lấy Client
          attributes: { exclude: ["password"] },
          raw: true,
        });

        if (!user) {
          resolve({
            errCode: 2,
            errMessage: "User not found",
          });
        } else {
          resolve({
            errCode: 0,
            errMessage: "OK",
            data: user,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      let user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (user) {
        user.email = data.email || user.email;
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.phoneNumber = data.phoneNumber || user.phoneNumber;

        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Update User Success!",
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "User not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await db.User.findOne({
        where: { id: userId, role: "Client" },
      }); // 👈 chỉ xóa Client
      if (!foundUser) {
        resolve({
          errCode: 2,
          errMessage: "User not found!",
        });
      } else {
        await db.User.destroy({ where: { id: userId } });
        resolve({
          errCode: 0,
          errMessage: "User deleted successfully!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
