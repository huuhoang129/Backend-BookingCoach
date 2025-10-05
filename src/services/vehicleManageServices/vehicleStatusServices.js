import db from "../../models/index.js";

/* ==========================
   Lấy tất cả tình trạng xe
========================== */
let getAllVehicleStatus = async () => {
  try {
    let data = await db.VehicleStatus.findAll({
      include: [{ model: db.Vehicle, as: "vehicle" }],
      order: [["lastUpdated", "DESC"]],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data,
    };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   Lấy tình trạng xe theo vehicleId
========================== */
let getStatusByVehicleId = async (vehicleId) => {
  try {
    if (!vehicleId) {
      return {
        errCode: 1,
        errMessage: "Missing parameter: vehicleId",
      };
    }

    const status = await db.VehicleStatus.findOne({
      where: { vehicleId },
      include: [{ model: db.Vehicle, as: "vehicle" }],
      raw: false,
      nest: true,
    });

    if (!status) {
      return {
        errCode: 2,
        errMessage: "Vehicle status not found",
      };
    }

    return {
      errCode: 0,
      errMessage: "OK",
      data: status,
    };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   Cập nhật hoặc tạo mới tình trạng xe
========================== */
let updateVehicleStatus = async (data) => {
  try {
    if (!data.vehicleId || !data.status) {
      return {
        errCode: 1,
        errMessage: "Missing required parameters",
      };
    }

    const existing = await db.VehicleStatus.findOne({
      where: { vehicleId: data.vehicleId },
    });

    if (existing) {
      await existing.update({
        status: data.status,
        note: data.note || null,
        lastUpdated: new Date(),
      });
    } else {
      await db.VehicleStatus.create({
        vehicleId: data.vehicleId,
        status: data.status,
        note: data.note || null,
        lastUpdated: new Date(),
      });
    }

    return {
      errCode: 0,
      errMessage: "Vehicle status updated successfully",
    };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   Xóa tình trạng xe (ít dùng)
========================== */
let deleteVehicleStatus = async (vehicleId) => {
  try {
    if (!vehicleId) {
      return {
        errCode: 1,
        errMessage: "Missing parameter: vehicleId",
      };
    }

    const found = await db.VehicleStatus.findOne({
      where: { vehicleId },
    });

    if (!found) {
      return {
        errCode: 2,
        errMessage: "Vehicle status not found",
      };
    }

    await found.destroy();

    return {
      errCode: 0,
      errMessage: "Vehicle status deleted successfully",
    };
  } catch (e) {
    throw e;
  }
};

export default {
  getAllVehicleStatus,
  getStatusByVehicleId,
  updateVehicleStatus,
  deleteVehicleStatus,
};
