import db from "../../models/index.js";
import { Op } from "sequelize";

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
        { model: db.Vehicle, as: "vehicle" },
        { model: db.TripPrices, as: "price" },
      ],
      order: [
        ["startDate", "ASC"],
        ["startTime", "ASC"],
      ],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data: trips };
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

// Tạo trip mới
let createTrip = async (data) => {
  try {
    if (
      !data.coachRouteId ||
      !data.vehicleId ||
      !data.tripPriceId ||
      !data.startDate ||
      !data.startTime
    ) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    await db.CoachTrip.create({
      coachRouteId: data.coachRouteId,
      vehicleId: data.vehicleId,
      tripPriceId: data.tripPriceId,
      startDate: data.startDate,
      startTime: data.startTime,
      totalTime: data.totalTime || null,
      status: data.status || "OPEN",
    });

    return { errCode: 0, errMessage: "Trip created successfully" };
  } catch (e) {
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
    const trip = await db.CoachTrip.findByPk(tripId);
    if (!trip) return { errCode: 2, errMessage: "Trip not found" };

    await trip.destroy();
    return { errCode: 0, errMessage: "Trip deleted successfully" };
  } catch (e) {
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
    if (!fromLocationId || !toLocationId || !startDate || !endDate) {
      return {
        errCode: 1,
        errMessage: "Missing required parameters",
        data: [],
      };
    }

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
          include: [{ model: db.Seat, as: "seat", attributes: ["id", "name"] }],
        },
        { model: db.TripPrices, as: "price" },
      ],
      where: {
        startDate: { [Op.between]: [startDate, endDate] },
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
      const seats = trip.vehicle?.seatVehicle || [];
      const bookedSeatIds = trip.bookingSeats?.map((b) => b.seatId) || [];

      const totalSeats = seats.length;
      const availableSeats = seats.filter((s) => !bookedSeatIds.includes(s.id));

      return {
        ...trip.toJSON(),
        totalSeats,
        availableSeats: availableSeats.length,
        seats: seats.map((s) => ({
          id: s.id,
          name: s.name,
          floor: s.floor,
          status: bookedSeatIds.includes(s.id) ? "SOLD" : "AVAILABLE",
        })),
      };
    });

    return { errCode: 0, errMessage: "OK", data: tripsWithSeats };
  } catch (e) {
    throw e;
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
