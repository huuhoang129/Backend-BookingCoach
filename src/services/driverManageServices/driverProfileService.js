// src/services/driverProfileService.js
import db from "../../models/index.js";

let getDriverProfileService = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: userId,
        role: "Driver",
      },
      attributes: [
        "id",
        "email",
        "firstName",
        "lastName",
        "phoneNumber",
        "userCode",
      ],
      include: [
        {
          model: db.StaffDetail,
          as: "staffDetail",
          attributes: ["address", "dateOfBirth", "citizenId"],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!user) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy thông tin tài xế",
        data: null,
      };
    }

    return {
      errCode: 0,
      errMessage: "OK",
      data: user,
    };
  } catch (error) {
    console.log("SERVICE ERROR:", error);
    return {
      errCode: -1,
      errMessage: "Lỗi server",
      data: null,
    };
  }
};

let updateDriverProfileService = async (userId, data) => {
  try {
    const driver = await db.User.findOne({
      where: { id: userId, role: "Driver" },
      raw: false,
    });

    if (!driver) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy tài xế",
        data: null,
      };
    }

    // Update User
    driver.firstName = data.firstName || driver.firstName;
    driver.lastName = data.lastName || driver.lastName;
    driver.phoneNumber = data.phoneNumber || driver.phoneNumber;
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

    return {
      errCode: 0,
      errMessage: "Cập nhật thông tin thành công",
      data: null,
    };
  } catch (error) {
    console.log("UPDATE DRIVER PROFILE ERROR:", error);
    return {
      errCode: -1,
      errMessage: "Lỗi server",
      data: null,
    };
  }
};

export default {
  getDriverProfileService,
  updateDriverProfileService,
};
