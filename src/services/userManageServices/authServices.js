import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import emailService from "../emailServices.js";

const salt = bcrypt.genSaltSync(10);
let resetOTPs = {};

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
        where: { email: email },
        raw: true,
      });

      if (!user) {
        userData.errCode = 1;
        userData.errMessage = "Email is not registered!";
        return resolve(userData);
      }

      // So sánh password
      let checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        userData.errCode = 2;
        userData.errMessage = "Wrong password!";
        return resolve(userData);
      }

      // Check status (nếu bị khóa thì không cho login)
      if (user.status === "Locking" || user.status === "Locked") {
        userData.errCode = 3;
        userData.errMessage = "Your account is locked. Please contact admin!";
        return resolve(userData);
      }

      // Login thành công
      delete user.password;
      userData.errCode = 0;
      userData.errMessage = "OK";
      userData.user = user;

      return resolve(userData);
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

        // 👉 B1: tạo user trước
        let newUser = await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          role: "Client", // mặc định Client
          status: "Active",
        });

        // 👉 B2: sinh mã code dựa vào role + id
        let userCode = generateUserCode(newUser.role, newUser.id);

        // 👉 B3: update lại user với mã vừa tạo
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

      console.log("🔑 [Service] Found user:", user.id);

      let tokenData = await db.PasswordReset.findOne({
        where: { userId: user.id, otp },
        order: [["createdAt", "DESC"]],
      });

      console.log("🔑 [Service] Token data:", tokenData);

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
      console.error("❌ [Service] ResetPassword error:", e);
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
