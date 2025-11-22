// src/services/stationManageServices/coachTripServices.js
import db from "../../models/index.js";
import { Op } from "sequelize";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

// Lấy tất cả chuyến xe
let getAllTrips = async () => {
  try {
    const trips = await db.CoachTrip.findAll({
      attributes: ["id", "startDate", "startTime", "totalTime", "status"],
      include: [
        {
          model: db.CoachRoute,
          as: "route",
          attributes: { exclude: ["imageRouteCoach"] },
          include: [
            {
              model: db.Location,
              as: "fromLocation",
              attributes: ["id", "nameLocations"],
            },
            {
              model: db.Location,
              as: "toLocation",
              attributes: ["id", "nameLocations"],
            },
          ],
        },
        {
          model: db.DriverSchedule,
          as: "driverSchedule",
          include: [
            {
              model: db.User,
              as: "driver",
              attributes: ["id", "firstName", "lastName", "phoneNumber"],
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
              attributes: ["id", "name", "floor"],
            },
          ],
        },
        {
          model: db.BookingSeats,
          as: "bookingSeats",
          attributes: ["id", "seatId", "status"],
          include: [{ model: db.Seat, as: "seat", attributes: ["id", "name"] }],
        },
        { model: db.TripPrices, as: "price" },
      ],
      order: [
        ["startDate", "ASC"],
        ["startTime", "ASC"],
      ],
      raw: false,
      nest: true,
    });

    // Tính ghế trống + thêm trạng thái tài xế
    const tripsWithSeats = trips.map((trip) => {
      const tripData = trip.toJSON();

      const seats = tripData.vehicle?.seatVehicle || [];
      const bookedSeatIds =
        tripData.bookingSeats
          ?.filter((b) => b.status !== "CANCELLED")
          .map((b) => b.seatId) || [];

      const availableSeats = seats.filter((s) => !bookedSeatIds.includes(s.id));

      const hasDriver = !!tripData.driverSchedule;
      const driverInfo = tripData.driverSchedule?.driver || null;
      const driverName = driverInfo
        ? `${driverInfo.firstName} ${driverInfo.lastName}`
        : null;

      return {
        ...tripData,
        totalSeats: seats.length,
        availableSeats: availableSeats.length,

        hasDriver,
        driver: driverInfo,
        driverName,
      };
    });

    return {
      errCode: 0,
      errMessage: "Lấy danh sách chuyến xe thành công",
      data: tripsWithSeats,
    };
  } catch (e) {
    console.error("getAllTrips error:", e);
    throw e;
  }
};

// Lấy chuyến xe theo ID
let getTripById = async (tripId) => {
  try {
    if (!tripId) {
      return { errCode: 1, errMessage: "Thiếu tham số tripId" };
    }

    const trip = await db.CoachTrip.findOne({
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
        { model: db.TripPrices, as: "price" },
      ],
      raw: false,
      nest: true,
    });

    if (!trip) return { errCode: 2, errMessage: "Không tìm thấy chuyến xe" };

    return {
      errCode: 0,
      errMessage: "Lấy thông tin chuyến xe thành công",
      data: trip,
    };
  } catch (e) {
    throw e;
  }
};

// Tính tổng phút từ chuỗi thời gian
const getDurationMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
};

// Tạo chuyến xe
let createTrip = async (data) => {
  try {
    const {
      coachRouteId,
      vehicleId,
      tripPriceId,
      startDate,
      startTime,
      totalTime,
      status,
    } = data;

    if (!coachRouteId || !vehicleId || !startDate || !startTime || !totalTime) {
      return { errCode: 1, errMessage: "Thiếu tham số bắt buộc" };
    }

    const tripStart = dayjs(`${startDate} ${startTime}`);
    const tripEnd = tripStart.add(getDurationMinutes(totalTime), "minute");

    const sameDayTrips = await db.CoachTrip.findAll({
      where: { vehicleId, startDate },
    });

    // Kiểm tra trùng lịch có thời gian buffer 1h
    for (const trip of sameDayTrips) {
      const existingStart = dayjs(`${trip.startDate} ${trip.startTime}`);
      const existingEnd = existingStart.add(
        getDurationMinutes(trip.totalTime),
        "minute"
      );

      const startBuffer = existingStart.subtract(60, "minute");
      const endBuffer = existingEnd.add(60, "minute");

      const overlap =
        tripStart.isBefore(endBuffer) && tripEnd.isAfter(startBuffer);

      if (overlap) {
        return {
          errCode: 3,
          errMessage: `Xe ${vehicleId} đã có chuyến từ ${existingStart.format(
            "HH:mm"
          )} đến ${existingEnd.format(
            "HH:mm"
          )}. Các chuyến phải cách nhau ít nhất 1 giờ.`,
        };
      }
    }

    await db.CoachTrip.create({
      coachRouteId,
      vehicleId,
      tripPriceId,
      startDate,
      startTime,
      totalTime,
      status: status || "OPEN",
    });

    return { errCode: 0, errMessage: "Tạo chuyến xe thành công" };
  } catch (e) {
    console.error("Lỗi tạo chuyến:", e);
    throw e;
  }
};

// Cập nhật chuyến xe
let updateTrip = async (id, data) => {
  try {
    if (!id) return { errCode: 1, errMessage: "Thiếu tham số id" };

    const [updated] = await db.CoachTrip.update(
      {
        coachRouteId: data.coachRouteId,
        vehicleId: data.vehicleId,
        tripPriceId: data.tripPriceId,
        startDate: data.startDate,
        startTime: data.startTime,
        totalTime: data.totalTime,
        status: data.status,
      },
      { where: { id } }
    );

    if (!updated) return { errCode: 2, errMessage: "Không tìm thấy chuyến xe" };

    return { errCode: 0, errMessage: "Cập nhật chuyến xe thành công" };
  } catch (e) {
    console.error("updateTrip error:", e);
    throw e;
  }
};

// Xóa chuyến xe
let deleteTrip = async (tripId) => {
  try {
    if (!tripId) return { errCode: 1, errMessage: "Thiếu tham số tripId" };

    const trip = await db.CoachTrip.findOne({ where: { id: tripId } });
    if (!trip) return { errCode: 2, errMessage: "Không tìm thấy chuyến xe" };

    await db.CoachTrip.destroy({ where: { id: tripId } });

    return { errCode: 0, errMessage: "Xóa chuyến xe thành công" };
  } catch (e) {
    console.error("deleteTrip error:", e);
    throw e;
  }
};

// Tìm chuyến theo tuyến và ngày
let findTripsByRouteAndDate = async (
  fromLocationId,
  toLocationId,
  startDate,
  endDate
) => {
  try {
    if (!fromLocationId || !toLocationId || !startDate) {
      return {
        errCode: 1,
        errMessage: "Thiếu tham số bắt buộc",
        data: [],
      };
    }

    const effectiveEndDate = endDate || startDate;

    const trips = await db.CoachTrip.findAll({
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
              attributes: ["id", "name", "floor"],
            },
          ],
        },
        {
          model: db.BookingSeats,
          as: "bookingSeats",
          attributes: ["id", "seatId", "status"],
          include: [{ model: db.Seat, as: "seat", attributes: ["id", "name"] }],
        },
        { model: db.TripPrices, as: "price" },
      ],
      where: {
        startDate: {
          [Op.between]: [startDate, effectiveEndDate],
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

    // Tính ghế trống và trạng thái ghế
    const tripsWithSeats = trips.map((trip) => {
      const tripData = trip.toJSON ? trip.toJSON() : trip;
      const seats = tripData.vehicle?.seatVehicle || [];

      const bookedSeatIds =
        tripData.bookingSeats
          ?.filter((b) => b.status !== "CANCELLED")
          .map((b) => b.seatId) || [];

      const availableSeats = seats.filter((s) => !bookedSeatIds.includes(s.id));

      return {
        ...tripData,
        totalSeats: seats.length,
        availableSeats: availableSeats.length,
        seats: seats.map((s) => ({
          id: s.id,
          name: s.name,
          floor: s.floor,
          status: bookedSeatIds.includes(s.id) ? "SOLD" : "AVAILABLE",
        })),
      };
    });

    return {
      errCode: 0,
      errMessage: "Lấy danh sách chuyến xe thành công",
      data: tripsWithSeats,
    };
  } catch (e) {
    console.error("findTripsByRouteAndDate error:", e);
    return {
      errCode: -1,
      errMessage: "Lỗi server",
      data: [],
    };
  }
};

export default {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  findTripsByRouteAndDate,
};
