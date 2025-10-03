import db from "../../models/index.js";

let getAllVehicles = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let vehicles = await db.Vehicle.findAll({
        include: [
          {
            model: db.CoachTrip,
            as: "trips",
          },
        ],
        order: [["id", "ASC"]],
        raw: false,
        nest: true,
      });

      // Thêm thống kê ghế (không trả danh sách seatVehicle)
      const data = await Promise.all(
        vehicles.map(async (v) => {
          const totalSeats = await db.Seat.count({
            where: { vehicleId: v.id },
          });
          const availableSeats = await db.Seat.count({
            where: { vehicleId: v.id, status: "AVAILABLE" },
          });
          const bookedSeats = totalSeats - availableSeats;

          return {
            ...v.toJSON(),
            totalSeats,
            availableSeats,
            bookedSeats,
          };
        })
      );

      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getVehicleById = (vehicleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!vehicleId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: vehicleId",
          data: null,
        });
      }

      let vehicle = await db.Vehicle.findOne({
        where: { id: vehicleId },
        include: [
          {
            model: db.CoachTrip,
            as: "trips",
          },
        ],
        raw: false,
        nest: true,
      });

      if (!vehicle) {
        return resolve({
          errCode: 2,
          errMessage: "Vehicle not found",
          data: null,
        });
      }

      const totalSeats = await db.Seat.count({ where: { vehicleId } });
      const availableSeats = await db.Seat.count({
        where: { vehicleId, status: "AVAILABLE" },
      });
      const bookedSeats = totalSeats - availableSeats;

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: {
          ...vehicle.toJSON(),
          totalSeats,
          availableSeats,
          bookedSeats,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createVehicle = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.type || !data.seatCount) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      // Nếu có biển số thì check trùng
      if (data.licensePlate) {
        let existing = await db.Vehicle.findOne({
          where: { licensePlate: data.licensePlate },
        });
        if (existing) {
          return resolve({
            errCode: 2,
            errMessage: "Vehicle already exists with the same licensePlate",
          });
        }
      }

      await db.Vehicle.create({
        name: data.name,
        licensePlate: data.licensePlate || null,
        description: data.description || null,
        type: data.type,
        numberFloors: data.numberFloors || 1,
        seatCount: data.seatCount,
      });

      resolve({
        errCode: 0,
        errMessage: "Vehicle created successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateVehicle = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.name || !data.type || !data.seatCount) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      // check tồn tại
      let vehicle = await db.Vehicle.findOne({ where: { id: data.id } });
      if (!vehicle) {
        return resolve({
          errCode: 2,
          errMessage: "Vehicle not found",
        });
      }

      // check trùng biển số (nếu có)
      if (data.licensePlate) {
        let existing = await db.Vehicle.findOne({
          where: { licensePlate: data.licensePlate },
        });
        if (existing && existing.id !== data.id) {
          return resolve({
            errCode: 3,
            errMessage: "Another vehicle already uses this licensePlate",
          });
        }
      }

      await db.Vehicle.update(
        {
          name: data.name,
          licensePlate: data.licensePlate || null,
          description: data.description || null,
          type: data.type,
          numberFloors: data.numberFloors || 1,
          seatCount: data.seatCount,
        },
        { where: { id: data.id } }
      );

      resolve({
        errCode: 0,
        errMessage: "Vehicle updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteVehicle = (vehicleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let vehicle = await db.Vehicle.findOne({ where: { id: vehicleId } });
      if (!vehicle) {
        return resolve({
          errCode: 2,
          errMessage: "Vehicle doesn't exist",
        });
      }

      await db.Vehicle.destroy({ where: { id: vehicleId } });

      resolve({
        errCode: 0,
        errMessage: "Vehicle deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
