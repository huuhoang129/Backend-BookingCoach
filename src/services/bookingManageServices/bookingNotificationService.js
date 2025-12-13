// src/services/bookingManageServices/bookingNotificationService.js
import db from "../../models/index.js";
import { Op } from "sequelize";

// Lấy danh sách booking mới từ thời điểm 'since'
let getNewBookingsService = async (since) => {
  try {
    const sinceTime = since ? new Date(since) : new Date(0);

    const newBookings = await db.Bookings.findAll({
      where: { createdAt: { [Op.gt]: sinceTime } },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.BookingCustomers,
          as: "customers",
          attributes: ["fullName", "phone", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: { exclude: ["imageRouteCoach"] },
              include: [
                {
                  model: db.Location,
                  as: "fromLocation",
                },
                {
                  model: db.Location,
                  as: "toLocation",
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    const formatted = newBookings.map((b) => {
      const customerName =
        (b.user?.lastName && b.user?.firstName
          ? `${b.user.lastName} ${b.user.firstName}`
          : null) ||
        b.customers?.[0]?.fullName ||
        "Khách vãng lai";

      const phone = b.user?.phoneNumber || b.customers?.[0]?.phone;

      const routeInfo = b.trip?.route
        ? `${b.trip.route.fromLocation?.nameLocations} → ${b.trip.route.toLocation?.nameLocations}`
        : "Chuyến xe không rõ";

      return {
        id: b.id,
        bookingCode: b.bookingCode,
        customerName,
        phone,
        routeName: routeInfo,
        createdAt: b.createdAt,
      };
    });

    return formatted;
  } catch (error) {
    console.error("getNewBookingsService error:", error);
    throw error;
  }
};

let getNewRefundsService = async (since) => {
  try {
    const sinceTime = since ? new Date(since) : new Date(0);

    const refunds = await db.BookingCancellation.findAll({
      where: { createdAt: { [Op.gt]: sinceTime } },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.Bookings,
          as: "booking",
          include: [
            {
              model: db.BookingCustomers,
              as: "customers",
              attributes: ["fullName", "phone"],
            },
            {
              model: db.CoachTrip,
              as: "trip",
              include: [
                {
                  model: db.CoachRoute,
                  as: "route",
                  include: [
                    { model: db.Location, as: "fromLocation" },
                    { model: db.Location, as: "toLocation" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    // Format dữ liệu trả về
    const formatted = refunds.map((r) => {
      const customerName =
        (r.user?.lastName && r.user?.firstName
          ? `${r.user.lastName} ${r.user.firstName}`
          : null) ||
        r.booking?.customers?.[0]?.fullName ||
        "Khách vãng lai";
      const phone =
        r.user?.phoneNumber || r.booking?.customers?.[0]?.phone || "";
      const routeInfo = r.booking?.trip?.route
        ? `${r.booking.trip.route.fromLocation?.nameLocations} → ${r.booking.trip.route.toLocation?.nameLocations}`
        : "Chuyến xe không rõ";

      return {
        id: r.id,
        bookingCode: r.bookingCode,
        customerName,
        phone,
        routeName: routeInfo,
        reason: r.reason,
        refundMethod: r.refundMethod,
        createdAt: r.createdAt,
      };
    });

    return formatted;
  } catch (error) {
    console.error("getNewRefundsService error:", error);
    throw error;
  }
};

export default { getNewBookingsService, getNewRefundsService };
