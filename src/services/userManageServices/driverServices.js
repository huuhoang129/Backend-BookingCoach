import db from "../../models/index.js";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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

let getAllDrivers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let drivers = await db.User.findAll({
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
        errMessage: "OK",
        data: drivers,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDriverById = (driverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!driverId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      }

      let driver = await db.User.findOne({
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
          errMessage: "Driver not found",
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "OK",
        data: driver,
      });
    } catch (e) {
      reject(e);
    }
  });
};

function generateDriverCode(id) {
  return `DRV${String(id).padStart(4, "0")}`;
}

let createDriver = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.firstName || !data.lastName) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      let existing = await db.User.findOne({ where: { email: data.email } });
      if (existing) {
        return resolve({
          errCode: 2,
          errMessage: "Email already in use!",
        });
      }

      let defaultPassword = "123456";
      let hashedPassword = await hashUserPassword(defaultPassword);

      // 1. Create driver user
      let newDriver = await db.User.create({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: "Driver",
        status: "Active",
      });

      // 2. Generate driver code
      let driverCode = generateDriverCode(newDriver.id);
      newDriver.userCode = driverCode;
      await newDriver.save();

      // 3. Create detail
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
        errMessage: "Create Driver Success!",
        defaultPassword,
        driverCode,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateDriver = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      let driver = await db.User.findOne({
        where: { id: data.id, role: "Driver" },
        raw: false,
      });

      if (!driver) {
        return resolve({
          errCode: 2,
          errMessage: "Driver not found!",
        });
      }

      driver.firstName = data.firstName || driver.firstName;
      driver.lastName = data.lastName || driver.lastName;
      driver.phoneNumber = data.phoneNumber || driver.phoneNumber;
      driver.email = data.email || driver.email;
      await driver.save();

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
        errMessage: "Update Driver Success!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteDriver = (driverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundDriver = await db.User.findOne({
        where: { id: driverId, role: "Driver" },
      });

      if (!foundDriver) {
        return resolve({
          errCode: 2,
          errMessage: "Driver not found!",
        });
      }

      await db.StaffDetail.destroy({ where: { userId: driverId } });
      await db.User.destroy({ where: { id: driverId } });

      return resolve({
        errCode: 0,
        errMessage: "Driver deleted successfully!",
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
