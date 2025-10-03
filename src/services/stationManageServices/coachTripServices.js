import db from "../../models/index.js";
import { Op } from "sequelize";

// Lấy tất cả trip
let getAllTrips = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let trips = await db.CoachTrip.findAll({
        include: [
          {
            model: db.CoachRoute,
            as: "route",
            attributes: { exclude: ["imageRouteCoach"] },
            include: [
              {
                model: db.Location,
                as: "fromLocation",
                include: [{ model: db.Province, as: "province" }],
              },
              {
                model: db.Location,
                as: "toLocation",
                include: [{ model: db.Province, as: "province" }],
              },
            ],
          },
          { model: db.Vehicle, as: "vehicle" },
          { model: db.TripPrices, as: "price" }, // ✅ include price
        ],
        order: [
          ["startDate", "ASC"],
          ["startTime", "ASC"],
        ],
        raw: false,
        nest: true,
      });

      resolve({ errCode: 0, errMessage: "OK", data: trips });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy trip theo id
let getTripById = (tripId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!tripId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: tripId",
          data: null,
        });
      }

      let trip = await db.CoachTrip.findOne({
        where: { id: tripId },
        include: [
          {
            model: db.CoachRoute,
            as: "route",
            attributes: { exclude: ["imageRouteCoach"] },
            include: [
              {
                model: db.Location,
                as: "fromLocation",
                include: [{ model: db.Province, as: "province" }],
              },
              {
                model: db.Location,
                as: "toLocation",
                include: [{ model: db.Province, as: "province" }],
              },
            ],
          },
          { model: db.Vehicle, as: "vehicle" },
          { model: db.TripPrices, as: "price" }, // ✅ include price
        ],
        raw: false,
        nest: true,
      });

      if (!trip) {
        return resolve({
          errCode: 2,
          errMessage: "Trip not found",
          data: null,
        });
      }

      resolve({ errCode: 0, errMessage: "OK", data: trip });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo trip mới
let createTrip = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.coachRouteId ||
        !data.vehicleId ||
        !data.tripPriceId || // ✅ thay basePrice
        !data.startDate ||
        !data.startTime
      ) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      await db.CoachTrip.create({
        coachRouteId: data.coachRouteId,
        vehicleId: data.vehicleId,
        tripPriceId: data.tripPriceId, // ✅ gắn id price
        startDate: data.startDate,
        startTime: data.startTime,
        totalTime: data.totalTime || null,
        status: data.status || "OPEN",
      });

      resolve({ errCode: 0, errMessage: "Trip created successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật trip
let updateTrip = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      const [updated] = await db.CoachTrip.update(
        {
          coachRouteId: data.coachRouteId,
          vehicleId: data.vehicleId,
          tripPriceId: data.tripPriceId, // ✅ thêm vào update
          startDate: data.startDate,
          startTime: data.startTime,
          totalTime: data.totalTime,
          status: data.status,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({ errCode: 2, errMessage: "Trip not found" });
      }

      resolve({ errCode: 0, errMessage: "Trip updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa trip
let deleteTrip = (tripId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let trip = await db.CoachTrip.findOne({ where: { id: tripId } });
      if (!trip) {
        resolve({ errCode: 2, errMessage: "Trip doesn't exist" });
      } else {
        await db.CoachTrip.destroy({ where: { id: tripId } });
        resolve({ errCode: 0, errMessage: "Trip deleted successfully" });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Tìm trip theo route + khoảng ngày
let findTripsByRouteAndDate = (
  fromLocationId,
  toLocationId,
  startDate,
  endDate
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fromLocationId || !toLocationId || !startDate || !endDate) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
          data: [],
        });
      }

      let trips = await db.CoachTrip.findAll({
        include: [
          {
            model: db.CoachRoute,
            as: "route",
            attributes: { exclude: ["imageRouteCoach"] },
            where: { fromLocationId, toLocationId },
            include: [
              {
                model: db.Location,
                as: "fromLocation",
                include: [{ model: db.Province, as: "province" }],
              },
              {
                model: db.Location,
                as: "toLocation",
                include: [{ model: db.Province, as: "province" }],
              },
            ],
          },
          {
            model: db.Vehicle,
            as: "vehicle",
            include: [
              {
                model: db.Seat,
                as: "seatVehicle",
                attributes: ["id", "name", "status", "floor"],
              },
            ],
          },
          { model: db.TripPrices, as: "price" }, // ✅ include price
        ],
        where: {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
          status: "OPEN",
        },
        order: [
          ["startDate", "ASC"],
          ["startTime", "ASC"],
        ],
        raw: false,
        nest: true,
      });

      let tripsWithSeats = trips.map((trip) => {
        const seats = trip.vehicle?.seatVehicle || [];
        const totalSeats = seats.length;
        const bookedSeats = seats.filter((s) => s.status === "SOLD").length;
        const availableSeats = totalSeats - bookedSeats;

        let plainTrip = trip.toJSON();
        delete plainTrip.vehicle.seatVehicle;

        return {
          ...plainTrip,
          totalSeats,
          availableSeats,
          seats: seats.map((s) => ({
            id: s.id,
            name: s.name,
            status: s.status,
            floor: s.floor,
          })),
        };
      });

      resolve({ errCode: 0, errMessage: "OK", data: tripsWithSeats });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  findTripsByRouteAndDate,
};
