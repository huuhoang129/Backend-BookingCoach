import db from "../../models/index.js";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

function generateUserCode(role, id) {
  if (role === "Staff") return `STF${String(id).padStart(4, "0")}`;
  if (role === "Driver") return `DRV${String(id).padStart(4, "0")}`;
  if (role === "Client") return `KH${String(id).padStart(4, "0")}`; // 👈 mã khách hàng
  return `EMP${String(id).padStart(4, "0")}`;
}

let createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      // Check email đã tồn tại chưa
      let existingUser = await db.User.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        return resolve({
          errCode: 2,
          errMessage: "Email is already in use!",
        });
      }

      // Hash password
      let hashPassword = await hashUserPassword(data.password);

      // 👉 Bước 1: tạo user trước
      let newUser = await db.User.create({
        email: data.email,
        password: hashPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: "Client", // mặc định Client
        status: "Active",
      });

      // 👉 Bước 2: sinh mã code dựa trên role + id
      let userCode = generateUserCode(newUser.role, newUser.id);

      // 👉 Bước 3: cập nhật lại bản ghi với userCode
      newUser.userCode = userCode; // đảm bảo trong model có cột customerCode
      await newUser.save();

      resolve({
        errCode: 0,
        errMessage: "Create User Success!",
        data: newUser, // trả luôn user vừa tạo cho FE nếu cần
      });
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
  createUser,
  updateUser,
  deleteUser,
};
