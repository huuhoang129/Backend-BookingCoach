import db from "../../models/index.js";
import { Op } from "sequelize";

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
        ],
        order: [
          ["startDate", "ASC"],
          ["startTime", "ASC"],
        ],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: trips,
      });
    } catch (e) {
      reject(e);
    }
  });
};

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

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: trip,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createTrip = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.coachRouteId ||
        !data.vehicleId ||
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
        startDate: data.startDate,
        startTime: data.startTime,
        totalTime: data.totalTime || null,
        status: data.status || "OPEN",
      });

      resolve({
        errCode: 0,
        errMessage: "Trip created successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

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
          startDate: data.startDate,
          startTime: data.startTime,
          totalTime: data.totalTime,
          status: data.status,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({
          errCode: 2,
          errMessage: "Trip not found",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Trip updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteTrip = (tripId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let trip = await db.CoachTrip.findOne({ where: { id: tripId } });
      if (!trip) {
        resolve({
          errCode: 2,
          errMessage: "Trip doesn't exist",
        });
      } else {
        await db.CoachTrip.destroy({ where: { id: tripId } });
        resolve({
          errCode: 0,
          errMessage: "Trip deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
          { model: db.Vehicle, as: "vehicle" },
        ],
        where: {
          startDate: {
            [Op.between]: [startDate, endDate], // 👈 lọc trong khoảng ngày
          },
          status: "OPEN",
        },
        order: [
          ["startDate", "ASC"], // 👈 sắp theo ngày
          ["startTime", "ASC"], // rồi theo giờ
        ],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: trips,
      });
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
