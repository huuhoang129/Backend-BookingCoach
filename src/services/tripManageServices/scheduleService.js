import db from "../../models/index.js";
import dayjs from "dayjs";

// Lấy tất cả schedules
let getAllSchedules = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let schedules = await db.CoachSchedule.findAll({
        include: [
          {
            model: db.CoachRoute,
            as: "route",
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
          { model: db.TripPrices, as: "price" },
        ],
        order: [["id", "ASC"]],
        raw: false,
        nest: true,
      });

      resolve({ errCode: 0, errMessage: "OK", data: schedules });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy schedule theo ID
let getScheduleById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      let schedule = await db.CoachSchedule.findOne({
        where: { id },
        include: [
          { model: db.CoachRoute, as: "route" },
          { model: db.Vehicle, as: "vehicle" },
          { model: db.TripPrices, as: "price" },
        ],
        raw: false,
        nest: true,
      });

      if (!schedule) {
        return resolve({ errCode: 2, errMessage: "Schedule not found" });
      }

      resolve({ errCode: 0, errMessage: "OK", data: schedule });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới schedule
let createSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.coachRouteId ||
        !data.vehicleId ||
        !data.tripPriceId ||
        !data.startTime
      ) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      await db.CoachSchedule.create({
        coachRouteId: data.coachRouteId,
        vehicleId: data.vehicleId,
        tripPriceId: data.tripPriceId,
        startTime: data.startTime,
        totalTime: data.totalTime || null,
        status: data.status || "ACTIVE",
      });

      resolve({ errCode: 0, errMessage: "Schedule created successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật schedule
let updateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      let schedule = await db.CoachSchedule.findOne({ where: { id: data.id } });
      if (!schedule) {
        return resolve({ errCode: 2, errMessage: "Schedule not found" });
      }

      await db.CoachSchedule.update(
        {
          coachRouteId: data.coachRouteId,
          vehicleId: data.vehicleId,
          tripPriceId: data.tripPriceId,
          startTime: data.startTime,
          totalTime: data.totalTime,
          status: data.status,
        },
        { where: { id: data.id } }
      );

      resolve({ errCode: 0, errMessage: "Schedule updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa schedule
let deleteSchedule = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let schedule = await db.CoachSchedule.findOne({ where: { id } });
      if (!schedule) {
        return resolve({ errCode: 2, errMessage: "Schedule doesn't exist" });
      }

      await db.CoachSchedule.destroy({ where: { id } });
      resolve({ errCode: 0, errMessage: "Schedule deleted successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

// Sinh trips từ schedules
let generateTripsFromSchedules = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let schedules = await db.CoachSchedule.findAll({
        where: { status: "ACTIVE" },
      });

      for (let s of schedules) {
        for (let i = 0; i < 7; i++) {
          let date = dayjs().add(i, "day").format("YYYY-MM-DD");

          let exist = await db.CoachTrip.findOne({
            where: {
              coachRouteId: s.coachRouteId,
              vehicleId: s.vehicleId,
              startDate: date,
              startTime: s.startTime,
            },
          });
          if (exist) continue;

          await db.CoachTrip.create({
            coachRouteId: s.coachRouteId,
            vehicleId: s.vehicleId,
            tripPriceId: s.tripPriceId,
            startDate: date,
            startTime: s.startTime,
            totalTime: s.totalTime,
            status: "OPEN",
          });
        }
      }

      resolve({ errCode: 0, errMessage: "Trips generated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateTripsFromSchedules,
};
