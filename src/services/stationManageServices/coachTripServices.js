import db from "../../models/index.js";
import { Op } from "sequelize";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

// Lấy tất cả trip
let getAllTrips = async () => {
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
    const tripsWithSeats = trips.map((trip) => {
      const tripData = trip.toJSON ? trip.toJSON() : trip;
      const seats = tripData.vehicle?.seatVehicle || [];
      const bookedSeatIds = tripData.bookingSeats?.map((b) => b.seatId) || [];
      const availableSeats = seats.filter((s) => !bookedSeatIds.includes(s.id));

      return {
        ...tripData,
        totalSeats: seats.length,
        availableSeats: availableSeats.length,
      };
    });

    return { errCode: 0, errMessage: "OK", data: tripsWithSeats };
  } catch (e) {
    throw e;
  }
};

// Lấy trip theo id
let getTripById = async (tripId) => {
  try {
    if (!tripId) {
      return { errCode: 1, errMessage: "Missing parameter: tripId" };
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
        { model: db.TripPrices, as: "price" },
      ],
      raw: false,
      nest: true,
    });

    if (!trip) return { errCode: 2, errMessage: "Trip not found" };

    return { errCode: 0, errMessage: "OK", data: trip };
  } catch (e) {
    throw e;
  }
};

const getDurationMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
};

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

    for (const trip of sameDayTrips) {
      const existingStart = dayjs(`${trip.startDate} ${trip.startTime}`);
      const existingEnd = existingStart.add(
        getDurationMinutes(trip.totalTime),
        "minute"
      );
      const existingStartWithBuffer = existingStart.subtract(60, "minute");
      const existingEndWithBuffer = existingEnd.add(60, "minute");
      const overlap =
        tripStart.isBefore(existingEndWithBuffer) &&
        tripEnd.isAfter(existingStartWithBuffer);

      if (overlap) {
        return {
          errCode: 3,
          errMessage: `Xe ${vehicleId} đã có chuyến từ ${existingStart.format(
            "HH:mm"
          )} đến ${existingEnd.format(
            "HH:mm"
          )}. Phải cách ít nhất 1 tiếng trước và sau chuyến này.`,
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
    console.error("❌ Lỗi khi tạo chuyến xe:", e);
    throw e;
  }
};

// Cập nhật trip
let updateTrip = async (data) => {
  try {
    if (!data.id) return { errCode: 1, errMessage: "Missing id" };

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
      { where: { id: data.id } }
    );

    if (!updated) return { errCode: 2, errMessage: "Trip not found" };
    return { errCode: 0, errMessage: "Trip updated successfully" };
  } catch (e) {
    throw e;
  }
};

// Xóa trip
let deleteTrip = async (tripId) => {
  try {
    if (!tripId) return { errCode: 1, errMessage: "Missing tripId" };

    const trip = await db.CoachTrip.findOne({ where: { id: tripId } });
    if (!trip) return { errCode: 2, errMessage: "Trip not found" };

    await db.CoachTrip.destroy({ where: { id: tripId } });

    return { errCode: 0, errMessage: "Trip deleted successfully" };
  } catch (e) {
    console.error("deleteTrip error:", e);
    throw e;
  }
};

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
        errMessage:
          "Missing required parameters (fromLocationId, toLocationId, startDate)",
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
          where: { fromLocationId, toLocationId }, // ✅ chỉ chiều đi
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

    const tripsWithSeats = trips.map((trip) => {
      const tripData = trip.toJSON ? trip.toJSON() : trip;
      const seats = tripData.vehicle?.seatVehicle || [];
      const bookedSeatIds = tripData.bookingSeats?.map((b) => b.seatId) || [];

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
      errMessage: "OK",
      data: tripsWithSeats,
    };
  } catch (e) {
    console.error("❌ Error in findTripsByRouteAndDate:", e);
    return {
      errCode: -1,
      errMessage: "Server error",
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
