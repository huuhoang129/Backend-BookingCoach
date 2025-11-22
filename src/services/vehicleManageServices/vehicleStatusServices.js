// src/services/vehicleManageServices/vehicleStatusServices.js
import db from "../../models/index.js";

// Lấy toàn bộ trạng thái xe
let getAllVehicleStatus = async () => {
  try {
    // Lấy danh sách trạng thái
    let data = await db.VehicleStatus.findAll({
      include: [{ model: db.Vehicle, as: "vehicle" }],
      order: [["updatedAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      errMessage: "Lấy danh sách trạng thái thành công",
      data,
    };
  } catch (e) {
    console.error("getAllVehicleStatus error:", e);
    throw e;
  }
};

// Lấy trạng thái xe
let getStatusByVehicleId = async (vehicleId) => {
  try {
    // Kiểm tra đầu vào
    if (!vehicleId) {
      return { errCode: 1, errMessage: "Thiếu tham số: vehicleId" };
    }

    // Tìm trạng thái
    const status = await db.VehicleStatus.findOne({
      where: { vehicleId },
      include: [{ model: db.Vehicle, as: "vehicle" }],
      raw: false,
      nest: true,
    });

    if (!status)
      return { errCode: 2, errMessage: "Không tìm thấy trạng thái của xe" };

    return {
      errCode: 0,
      errMessage: "Lấy trạng thái thành công",
      data: status,
    };
  } catch (e) {
    console.error("getStatusByVehicleId error:", e);
    throw e;
  }
};

// Tạo hoặc cập nhật trạng thái xe
let updateVehicleStatus = async (data) => {
  try {
    // Kiểm tra dữ liệu bắt buộc
    if (!data.vehicleId || !data.status) {
      return { errCode: 1, errMessage: "Thiếu dữ liệu bắt buộc" };
    }

    // Tìm trạng thái cũ
    const existing = await db.VehicleStatus.findOne({
      where: { vehicleId: data.vehicleId },
      raw: false,
    });

    // Nếu trạng thái không thay đổi
    if (existing) {
      if (
        existing.status === data.status &&
        existing.note === (data.note || null)
      ) {
        return {
          errCode: 2,
          errMessage: "Trạng thái xe đã đúng, không cần cập nhật",
        };
      }

      // Cập nhật trạng thái
      await existing.update({
        status: data.status,
        note: data.note || null,
      });

      return {
        errCode: 0,
        errMessage: "Cập nhật trạng thái xe thành công",
      };
    } else {
      // Tạo mới trạng thái xe nếu chưa có
      await db.VehicleStatus.create({
        vehicleId: data.vehicleId,
        status: data.status,
        note: data.note || null,
      });

      return {
        errCode: 0,
        errMessage: "Tạo trạng thái xe mới thành công",
      };
    }
  } catch (e) {
    console.error("updateVehicleStatus error:", e);
    throw e;
  }
};

// Xóa trạng thái xe
let deleteVehicleStatus = async (id) => {
  // Xóa theo id
  const deleted = await db.VehicleStatus.destroy({ where: { id } });

  if (!deleted)
    return { errCode: 2, errMessage: "Không tìm thấy trạng thái để xóa" };

  return { errCode: 0, errMessage: "Xóa trạng thái xe thành công" };
};

export default {
  getAllVehicleStatus,
  getStatusByVehicleId,
  updateVehicleStatus,
  deleteVehicleStatus,
};
