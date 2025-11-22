// src/services/userManageServices/driverServices.js
import db from "../../models/index.js";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

// Hash mật khẩu người dùng
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

// Lấy danh sách tất cả tài xế
let getAllDrivers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const drivers = await db.User.findAll({
        where: { role: "Driver" },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.StaffDetail,
            as: "staffDetail",
            attributes: ["address", "dateOfBirth", "citizenId"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách tài xế thành công",
        data: drivers,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy thông tin tài xế theo ID
let getDriverById = (driverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate tham số
      if (!driverId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số driverId",
        });
      }

      const driver = await db.User.findOne({
        where: { id: driverId, role: "Driver" },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.StaffDetail,
            as: "staffDetail",
            attributes: ["address", "dateOfBirth", "citizenId"],
          },
        ],
        raw: true,
        nest: true,
      });

      if (!driver) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy tài xế",
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "Lấy thông tin tài xế thành công",
        data: driver,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mã tài xế từ ID (ví dụ: DRV0001)
function generateDriverCode(id) {
  return `DRV${String(id).padStart(4, "0")}`;
}

// Tạo mới tài xế
let createDriver = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate các trường bắt buộc
      if (!data.email || !data.firstName || !data.lastName) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu các trường bắt buộc",
        });
      }

      // Kiểm tra email đã tồn tại
      const existing = await db.User.findOne({ where: { email: data.email } });
      if (existing) {
        return resolve({
          errCode: 2,
          errMessage: "Email đã được sử dụng",
        });
      }

      // Mật khẩu mặc định
      const defaultPassword = "123456";
      const hashedPassword = await hashUserPassword(defaultPassword);

      // 1. Tạo user với vai trò tài xế
      const newDriver = await db.User.create({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: "Driver",
        status: "Active",
      });

      // 2. Sinh mã tài xế (userCode)
      const driverCode = generateDriverCode(newDriver.id);
      newDriver.userCode = driverCode;
      await newDriver.save();

      // 3. Tạo StaffDetail nếu có thông tin bổ sung
      if (data.address || data.dateOfBirth || data.citizenId) {
        await db.StaffDetail.create({
          userId: newDriver.id,
          address: data.address || null,
          dateOfBirth: data.dateOfBirth || null,
          citizenId: data.citizenId || null,
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "Tạo tài xế thành công",
        defaultPassword,
        driverCode,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin tài xế
let updateDriver = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Bắt buộc phải có id
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số id",
        });
      }

      // Tìm user là tài xế
      const driver = await db.User.findOne({
        where: { id: data.id, role: "Driver" },
        raw: false,
      });

      if (!driver) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy tài xế",
        });
      }

      // Cập nhật thông tin cơ bản
      driver.firstName = data.firstName || driver.firstName;
      driver.lastName = data.lastName || driver.lastName;
      driver.phoneNumber = data.phoneNumber || driver.phoneNumber;
      driver.email = data.email || driver.email;
      await driver.save();

      // Cập nhật hoặc tạo mới StaffDetail
      let staffDetail = await db.StaffDetail.findOne({
        where: { userId: driver.id },
        raw: false,
      });

      if (staffDetail) {
        staffDetail.address = data.address || staffDetail.address;
        staffDetail.dateOfBirth = data.dateOfBirth || staffDetail.dateOfBirth;
        staffDetail.citizenId = data.citizenId || staffDetail.citizenId;
        await staffDetail.save();
      } else if (data.address || data.dateOfBirth || data.citizenId) {
        await db.StaffDetail.create({
          userId: driver.id,
          address: data.address || null,
          dateOfBirth: data.dateOfBirth || null,
          citizenId: data.citizenId || null,
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "Cập nhật tài xế thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa tài xế
let deleteDriver = (driverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm tài xế theo ID
      const foundDriver = await db.User.findOne({
        where: { id: driverId, role: "Driver" },
      });

      if (!foundDriver) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy tài xế",
        });
      }

      // Xóa chi tiết nhân viên trước
      await db.StaffDetail.destroy({ where: { userId: driverId } });
      // Xóa user
      await db.User.destroy({ where: { id: driverId } });

      return resolve({
        errCode: 0,
        errMessage: "Xóa tài xế thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
