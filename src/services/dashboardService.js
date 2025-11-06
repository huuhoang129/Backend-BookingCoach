import db from "../models";
import { Op, fn, col } from "sequelize";
import dayjs from "dayjs";

const getOverview = async () => {
  const startOfMonth = dayjs().startOf("month").toDate();
  const endOfMonth = dayjs().endOf("month").toDate();
  const totalRevenue = await db.BookingPayments.sum("amount", {
    where: {
      status: "SUCCESS",
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });
  const totalTrips = await db.CoachTrip.count({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });
  const totalTickets = await db.BookingSeats.count({
    include: [
      {
        model: db.Bookings,
        as: "booking",
        where: {
          status: "CONFIRMED",
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      },
    ],
  });
  const activeDrivers = await db.User.count({
    where: { role: "Driver", status: "Active" },
  });

  return {
    errCode: 0,
    data: {
      totalRevenue: totalRevenue || 0,
      totalTrips,
      totalTickets,
      activeDrivers,
      month: dayjs().format("MM/YYYY"),
    },
  };
};

const getCharts = async () => {
  const startOfMonth = dayjs().startOf("month");
  const endOfMonth = dayjs().endOf("month");
  const daysInMonth = endOfMonth.date();
  const revenueData = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDay = startOfMonth.date(i);

    const total = await db.BookingPayments.sum("amount", {
      where: {
        status: "SUCCESS",
        createdAt: {
          [Op.between]: [
            currentDay.startOf("day").toDate(),
            currentDay.endOf("day").toDate(),
          ],
        },
      },
    });

    revenueData.push({
      date: currentDay.format("DD/MM"),
      revenue: total || 0,
    });
  }

  const totalBookings = await db.Bookings.count({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()],
      },
    },
  });

  const success = await db.Bookings.count({
    where: {
      status: "CONFIRMED",
      createdAt: { [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()] },
    },
  });

  const canceled = await db.Bookings.count({
    where: {
      status: "CANCELLED",
      createdAt: { [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()] },
    },
  });

  const pending = await db.Bookings.count({
    where: {
      status: "PENDING",
      createdAt: { [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()] },
    },
  });

  return {
    errCode: 0,
    data: {
      month: dayjs().format("MM/YYYY"),
      revenueChart: revenueData,
      bookingRatio: [
        {
          name: "Thành công",
          value: totalBookings
            ? Math.round((success / totalBookings) * 100)
            : 0,
        },
        {
          name: "Đã hủy",
          value: totalBookings
            ? Math.round((canceled / totalBookings) * 100)
            : 0,
        },
        {
          name: "Đang chờ",
          value: totalBookings
            ? Math.round((pending / totalBookings) * 100)
            : 0,
        },
      ],
    },
  };
};

const getTopRoutes = async () => {
  const data = await db.BookingSeats.findAll({
    attributes: [
      [fn("COUNT", col("BookingSeats.id")), "sold"],

      [col("booking.trip.route.id"), "routeId"],
      [col("booking.trip.route.fromLocation.id"), "fromLocationId"],
      [
        col("booking.trip.route.fromLocation.nameLocations"),
        "fromLocationName",
      ],
      [col("booking.trip.route.toLocation.id"), "toLocationId"],
      [col("booking.trip.route.toLocation.nameLocations"), "toLocationName"],

      [col("booking.trip.vehicle.type"), "vehicleType"],
    ],
    include: [
      {
        model: db.Bookings,
        as: "booking",
        required: true,
        attributes: [],
        include: [
          {
            model: db.CoachTrip,
            as: "trip",
            required: true,
            attributes: [],
            include: [
              {
                model: db.CoachRoute,
                as: "route",
                required: true,
                attributes: [],
                include: [
                  {
                    model: db.Location,
                    as: "fromLocation",
                    attributes: [],
                    required: true,
                  },
                  {
                    model: db.Location,
                    as: "toLocation",
                    attributes: [],
                    required: true,
                  },
                ],
              },
              {
                model: db.Vehicle,
                as: "vehicle",
                required: true,
                attributes: [],
              },
            ],
          },
        ],
      },
    ],
    group: [
      "booking.trip.route.id",
      "booking.trip.vehicle.id",
      "booking.trip.route.fromLocation.id",
      "booking.trip.route.toLocation.id",
    ],
    order: [[fn("COUNT", col("BookingSeats.id")), "DESC"]],
    limit: 5,
    raw: true,
  });

  return {
    errCode: 0,
    data,
  };
};

export default { getOverview, getCharts, getTopRoutes };
