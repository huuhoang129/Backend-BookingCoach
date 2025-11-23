// src/services/userManageServices/authServices.js
import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import emailService from "../emailServices.js";
import { generateToken } from "../../middleware/auth/token.js";

const salt = bcrypt.genSaltSync(10);

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let user = await db.User.findOne({
        attributes: [
          "id",
          "email",
          "password",
          "firstName",
          "lastName",
          "phoneNumber",
          "role",
          "status",
        ],
        where: { email },
        raw: true,
      });

      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "Email is not registered!",
        });
      }

      let checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return resolve({
          errCode: 2,
          errMessage: "Wrong password!",
        });
      }

      if (user.status === "Locking" || user.status === "Locked") {
        return resolve({
          errCode: 3,
          errMessage: "Your account is locked!",
        });
      }

      const token = generateToken(user);

      delete user.password;

      return resolve({
        errCode: 0,
        errMessage: "OK",
        user,
        token,
      });
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
  if (role === "Client") return `KH${String(id).padStart(4, "0")}`;
  return `EMP${String(id).padStart(4, "0")}`;
}

let handleUserRegister = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage:
            "Your Email Is Already In Used. Please Try Another Email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);

        // Tạo user trước
        let newUser = await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          role: "Client",
          status: "Active",
        });

        let userCode = generateUserCode(newUser.role, newUser.id);

        // Update lại user với mã vừa tạo
        newUser.userCode = userCode;
        await newUser.save();

        resolve({
          errCode: 0,
          message: "Register Success!",
          data: {
            id: newUser.id,
            email: newUser.email,
            customerCode: newUser.customerCode,
          },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleForgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email } });
      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "Email không tồn tại trong hệ thống!",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await db.PasswordReset.create({
        userId: user.id,
        otp: otp,
        expires: Date.now() + 5 * 60 * 1000,
      });

      await emailService.sendPasswordResetEmail({
        receiverEmail: email,
        otp: otp,
      });

      resolve({
        errCode: 0,
        message: "OTP đã được gửi tới email!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let handleResetPassword = (email, otp, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔑 [Service] ResetPassword input:", {
        email,
        otp,
        newPassword,
      });

      let user = await db.User.findOne({ where: { email } });
      if (!user) {
        return resolve({ errCode: 1, errMessage: "Email không tồn tại!" });
      }

      console.log("[Service] Found user:", user.id);

      let tokenData = await db.PasswordReset.findOne({
        where: { userId: user.id, otp },
        order: [["createdAt", "DESC"]],
      });

      console.log("[Service] Token data:", tokenData);

      if (!tokenData) {
        return resolve({
          errCode: 2,
          errMessage: "OTP không tồn tại hoặc sai!",
        });
      }

      if (Date.now() > tokenData.expires) {
        return resolve({ errCode: 3, errMessage: "OTP đã hết hạn!" });
      }

      let hashPassword = bcrypt.hashSync(newPassword, salt);

      await db.User.update(
        { password: hashPassword },
        { where: { id: user.id } }
      );

      await db.PasswordReset.destroy({ where: { id: tokenData.id } });

      resolve({ errCode: 0, message: "Đặt lại mật khẩu thành công!" });
    } catch (e) {
      console.error("[Service] ResetPassword error:", e);
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  handleUserRegister: handleUserRegister,
  handleForgotPassword: handleForgotPassword,
  handleResetPassword: handleResetPassword,
};
