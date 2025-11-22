import db from "../../models/index.js";

let verifyBookingByCode = async (bookingCode) => {
  try {
    const booking = await db.Bookings.findOne({
      where: { bookingCode },
      include: [
        { model: db.BookingCustomers, as: "customers" },
        {
          model: db.BookingSeats,
          as: "seats",
          include: [{ model: db.Seat, as: "seat" }],
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
      raw: false,
      nest: true,
    });

    if (!booking) {
      return {
        errCode: 1,
        errMessage: "Booking not found",
        data: null,
      };
    }
    const payment = await db.BookingPayments.findOne({
      where: { bookingId: booking.id },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: {
        bookingCode: booking.bookingCode,
        totalAmount: booking.totalAmount,
        paymentStatus: payment?.status,
        paymentMethod: payment?.method || "N/A",
        customerName: booking.customers?.[0]?.fullName || null,
        customerPhone: booking.customers?.[0]?.phone || null,
        route: booking.trip?.route
          ? `${booking.trip.route.fromLocation?.nameLocations} → ${booking.trip.route.toLocation?.nameLocations}`
          : null,
        startDate: booking.trip?.startDate || null,
        startTime: booking.trip?.startTime || null,
        seats: booking.seats?.map((s) => s.seat?.name) || [],
      },
    };
  } catch (e) {
    console.error("verifyBookingByCode error:", e);
    return {
      errCode: -1,
      errMessage: "Internal server error",
      data: null,
    };
  }
};

export default { verifyBookingByCode };
