import db from "../../models/index.js";

/* ==========================
   GET ALL VEHICLES
========================== */
let getAllVehicles = async () => {
  try {
    let vehicles = await db.Vehicle.findAll({
      include: [
        { model: db.CoachTrip, as: "trips" },
        { model: db.VehicleStatus, as: "status" }, // ✅ include thêm tình trạng
      ],
      order: [["id", "ASC"]],
      raw: false,
      nest: true,
    });

    // Tính tổng ghế
    const data = await Promise.all(
      vehicles.map(async (v) => {
        const totalSeats = await db.Seat.count({ where: { vehicleId: v.id } });
        return { ...v.toJSON(), totalSeats };
      })
    );

    return { errCode: 0, errMessage: "OK", data };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   GET VEHICLE BY ID
========================== */
let getVehicleById = async (vehicleId) => {
  try {
    if (!vehicleId) {
      return { errCode: 1, errMessage: "Missing vehicleId", data: null };
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
      return { errCode: 2, errMessage: "Vehicle not found", data: null };
    }

    const totalSeats = await db.Seat.count({ where: { vehicleId } });

    return {
      errCode: 0,
      errMessage: "OK",
      data: { ...vehicle.toJSON(), totalSeats },
    };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   CREATE VEHICLE
========================== */
let createVehicle = async (data) => {
  try {
    if (!data.name || !data.type || !data.seatCount) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    if (data.licensePlate) {
      const existing = await db.Vehicle.findOne({
        where: { licensePlate: data.licensePlate },
      });
      if (existing) {
        return {
          errCode: 2,
          errMessage: "Vehicle already exists with this licensePlate",
        };
      }
    }

    // ✅ Tạo xe
    const vehicle = await db.Vehicle.create({
      name: data.name,
      licensePlate: data.licensePlate || null,
      description: data.description || null,
      type: data.type,
      numberFloors: data.numberFloors || 1,
      seatCount: data.seatCount,
    });

    // ✅ Tạo tình trạng mặc định
    await db.VehicleStatus.create({
      vehicleId: vehicle.id,
      status: "GOOD",
      note: "Xe mới tạo, tình trạng tốt",
      lastUpdated: new Date(),
    });

    return { errCode: 0, errMessage: "Vehicle created successfully" };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   UPDATE VEHICLE
========================== */
let updateVehicle = async (data) => {
  try {
    if (!data.id || !data.name || !data.type || !data.seatCount) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    const vehicle = await db.Vehicle.findByPk(data.id);
    if (!vehicle) {
      return { errCode: 2, errMessage: "Vehicle not found" };
    }

    if (data.licensePlate) {
      const existing = await db.Vehicle.findOne({
        where: { licensePlate: data.licensePlate },
      });
      if (existing && existing.id !== data.id) {
        return {
          errCode: 3,
          errMessage: "Another vehicle already uses this licensePlate",
        };
      }
    }

    await vehicle.update({
      name: data.name,
      licensePlate: data.licensePlate || null,
      description: data.description || null,
      type: data.type,
      numberFloors: data.numberFloors || 1,
      seatCount: data.seatCount,
    });

    return { errCode: 0, errMessage: "Vehicle updated successfully" };
  } catch (e) {
    throw e;
  }
};

/* ==========================
   DELETE VEHICLE
========================== */
let deleteVehicle = async (vehicleId) => {
  try {
    const vehicle = await db.Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return { errCode: 2, errMessage: "Vehicle doesn't exist" };
    }

    // Xóa dữ liệu phụ
    await db.VehicleStatus.destroy({ where: { vehicleId } });
    await db.Seat.destroy({ where: { vehicleId } });
    await db.CoachTrip.destroy({ where: { vehicleId } });

    // ✅ Xóa vehicle an toàn (không cần instance)
    await db.Vehicle.destroy({ where: { id: vehicleId } });

    return { errCode: 0, errMessage: "Vehicle deleted successfully" };
  } catch (e) {
    console.error("❌ deleteVehicle error:", e);
    return {
      errCode: -1,
      errMessage: "Error deleting vehicle",
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
