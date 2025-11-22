// src/services/vehicleManageServices/vehicleServices.js
import db from "../../models/index.js";
import { generateSeats } from "../../ultis/seatGenerator";
import { Op } from "sequelize";

// Lấy toàn bộ danh sách xe
let getAllVehicles = async () => {
  try {
    let vehicles = await db.Vehicle.findAll({
      include: [
        { model: db.CoachTrip, as: "trips" },
        { model: db.VehicleStatus, as: "status" },
      ],
      order: [["id", "ASC"]],
      raw: false,
      nest: true,
    });

    // Đếm tổng số ghế hiện có trong Seat
    const data = await Promise.all(
      vehicles.map(async (v) => {
        const totalSeats = await db.Seat.count({ where: { vehicleId: v.id } });
        return { ...v.toJSON(), totalSeats };
      })
    );

    return { errCode: 0, errMessage: "Lấy danh sách xe thành công", data };
  } catch (e) {
    throw e;
  }
};

// Lấy thông tin chi tiết một xe theo ID
let getVehicleById = async (vehicleId) => {
  try {
    // Validate input tránh query không cần thiết
    if (!vehicleId) {
      return { errCode: 1, errMessage: "Thiếu mã xe (vehicleId)", data: null };
    }

    let vehicle = await db.Vehicle.findOne({
      where: { id: vehicleId },
      include: [
        { model: db.CoachTrip, as: "trips" },
        { model: db.VehicleStatus, as: "status" },
      ],
      raw: false,
      nest: true,
    });

    if (!vehicle) {
      return { errCode: 2, errMessage: "Không tìm thấy xe", data: null };
    }

    // Đếm tổng số ghế của xe từ bảng Seat
    const totalSeats = await db.Seat.count({ where: { vehicleId } });
    return {
      errCode: 0,
      errMessage: "Lấy thông tin xe thành công",
      data: { ...vehicle.toJSON(), totalSeats },
    };
  } catch (e) {
    throw e;
  }
};

// Tạo mới một xe
let createVehicle = async (data) => {
  try {
    // Kiểm tra các trường bắt buộc
    if (!data.name || !data.type) {
      return { errCode: 1, errMessage: "Thiếu thông tin bắt buộc" };
    }

    // Kiểm tra trùng biển số xe
    if (data.licensePlate) {
      const existing = await db.Vehicle.findOne({
        where: { licensePlate: data.licensePlate },
      });
      if (existing) {
        return {
          errCode: 2,
          errMessage: "Đã tồn tại xe với biển số này",
        };
      }
    }

    // Tạo bản ghi xe
    const vehicle = await db.Vehicle.create({
      name: data.name,
      licensePlate: data.licensePlate || null,
      description: data.description || null,
      type: data.type,
      numberFloors: data.numberFloors || 1,
      seatCount: data.seatCount,
    });

    // Khởi tạo trạng thái mặc định cho xe mới tạo
    await db.VehicleStatus.create({
      vehicleId: vehicle.id,
      status: "GOOD",
      note: "Xe mới tạo, tình trạng tốt",
      lastUpdated: new Date(),
    });

    // Sinh danh sách ghế tự động theo loại xe
    const seats = generateSeats(vehicle.id, data.type);
    if (seats.length > 0) await db.Seat.bulkCreate(seats);

    return {
      errCode: 0,
      errMessage: `Thêm mới xe thành công với ${seats.length} ghế`,
    };
  } catch (e) {
    console.error("createVehicle error:", e);
    throw e;
  }
};

// Cập nhật thông tin xe
let updateVehicle = async (data) => {
  try {
    // Validate dữ liệu đầu vào
    if (!data.id || !data.name || !data.type) {
      return { errCode: 1, errMessage: "Thiếu thông tin bắt buộc" };
    }

    const vehicle = await db.Vehicle.findByPk(data.id);
    if (!vehicle) {
      return { errCode: 2, errMessage: "Xe không tồn tại" };
    }

    // Kiểm tra trùng biển số với xe khác
    if (data.licensePlate) {
      const existing = await db.Vehicle.findOne({
        where: { licensePlate: data.licensePlate },
      });
      if (existing && existing.id !== data.id) {
        return {
          errCode: 3,
          errMessage: "Biển số này đã được sử dụng bởi xe khác",
        };
      }
    }

    const oldType = vehicle.type;
    const newType = data.type;

    // Cập nhật các thông tin cơ bản
    await db.Vehicle.update(
      {
        name: data.name,
        licensePlate: data.licensePlate || null,
        description: data.description || null,
        type: newType,
        numberFloors: data.numberFloors || 1,
        seatCount: data.seatCount,
      },
      { where: { id: data.id } }
    );

    // Nếu đổi loại xe, đồng bộ lại cấu hình ghế
    if (oldType !== newType) {
      console.log(
        `Vehicle ${vehicle.id} đổi loại từ ${oldType} sang ${newType}`
      );
      // Xóa toàn bộ ghế cũ của xe
      await db.Seat.destroy({ where: { vehicleId: vehicle.id } });

      // Sinh lại danh sách ghế theo loại xe mới
      const seats = generateSeats(vehicle.id, newType);
      if (seats.length > 0) await db.Seat.bulkCreate(seats);

      // Cập nhật lại số lượng ghế
      await db.Vehicle.update(
        { seatCount: seats.length },
        { where: { id: vehicle.id } }
      );

      return {
        errCode: 0,
        errMessage: `Cập nhật xe thành công và tạo lại ${seats.length} ghế`,
      };
    }

    return { errCode: 0, errMessage: "Cập nhật xe thành công" };
  } catch (e) {
    console.error("updateVehicle error:", e);
    throw e;
  }
};

// Xóa xe khỏi hệ thống
let deleteVehicle = async (vehicleId) => {
  const t = await db.sequelize.transaction();
  try {
    const vehicle = await db.Vehicle.findByPk(vehicleId, { transaction: t });
    if (!vehicle) {
      await t.rollback();
      return { errCode: 2, errMessage: "Xe không tồn tại" };
    }

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 8);

    // Kiểm tra xem xe còn chuyến trong tương lai không
    const futureTripCount = await db.CoachTrip.count({
      where: {
        vehicleId,
        [Op.or]: [
          { startDate: { [Op.gt]: todayStr } },
          {
            startDate: todayStr,
            startTime: { [Op.gt]: timeStr },
          },
        ],
      },
      transaction: t,
    });

    if (futureTripCount > 0) {
      await t.rollback();
      return {
        errCode: 3,
        errMessage:
          "Không thể xóa xe vì đang có chuyến sử dụng xe này trong tương lai",
      };
    }

    await db.VehicleStatus.destroy({ where: { vehicleId }, transaction: t });
    await db.Seat.destroy({ where: { vehicleId }, transaction: t });
    await db.CoachTrip.destroy({ where: { vehicleId }, transaction: t });
    await db.Vehicle.destroy({ where: { id: vehicleId }, transaction: t });
    await t.commit();

    return { errCode: 0, errMessage: "Xóa xe thành công" };
  } catch (e) {
    await t.rollback();
    console.error("deleteVehicle error:", e);
    return {
      errCode: -1,
      errMessage: "Có lỗi xảy ra khi xóa xe",
      error: e.message,
    };
  }
};

export default {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
