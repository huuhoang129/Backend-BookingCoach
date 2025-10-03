import db from "../../models/index.js";

/**
 * Lấy tất cả bookings
 */
let getAllBookings = async () => {
  try {
    let bookings = await db.Bookings.findAll({
      include: [
        { model: db.BookingCustomers, as: "customers" },
        {
          model: db.BookingPoints,
          as: "points",
          include: [{ model: db.Location, as: "Location" }],
        },
        { model: db.BookingSeats, as: "seats" },
        { model: db.BookingPayments, as: "payment" },
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
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data: bookings };
  } catch (e) {
    throw e;
  }
};

/**
 * Lấy booking theo id
 */
let getBookingById = async (bookingId) => {
  try {
    if (!bookingId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter: bookingId",
        data: null,
      };
    }

    let booking = await db.Bookings.findOne({
      where: { id: bookingId },
      include: [
        { model: db.BookingCustomers, as: "customers" },
        {
          model: db.BookingPoints,
          as: "points",
          include: [{ model: db.Location, as: "Location" }],
        },
        { model: db.BookingSeats, as: "seats" },
        { model: db.BookingPayments, as: "payment" },
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
      return { errCode: 2, errMessage: "Booking not found", data: null };
    }

    return { errCode: 0, errMessage: "OK", data: booking };
  } catch (e) {
    throw e;
  }
};

/**
 * Generate bookingCode: BK + YYYYMMDD + 4 số random
 */
const generateBookingCode = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK${y}${m}${d}${rand}`;
};

/**
 * Tạo booking mới
 */
let createBooking = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    if (!data.coachTripId || !data.seats || !data.totalAmount) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    // 🔥 Generate bookingCode
    const bookingCode = generateBookingCode();

    // 1. Booking
    const newBooking = await db.Bookings.create(
      {
        userId: data.userId || null,
        coachTripId: data.coachTripId,
        status: "PENDING",
        totalAmount: data.totalAmount,
        bookingCode,
      },
      { transaction: t }
    );

    // 2. Customers
    if (data.customers?.length > 0) {
      await db.BookingCustomers.bulkCreate(
        data.customers.map((c) => ({
          bookingId: newBooking.id,
          fullName: c.fullName,
          phone: c.phone,
          email: c.email,
        })),
        { transaction: t }
      );
    }

    // 3. Points
    if (data.points?.length > 0) {
      await db.BookingPoints.bulkCreate(
        data.points.map((p) => ({
          bookingId: newBooking.id,
          type: p.type,
          locationId: p.locationId,
          time: p.time,
          note: p.note,
        })),
        { transaction: t }
      );
    }

    // 4. Seats
    if (data.seats?.length > 0) {
      for (let s of data.seats) {
        const seat = await db.Seat.findOne({
          where: { id: s.seatId },
          transaction: t,
        });
        if (!seat) {
          await t.rollback();
          return { errCode: 2, errMessage: `Seat ${s.seatId} not found` };
        }
        if (seat.status !== "AVAILABLE") {
          await t.rollback();
          return {
            errCode: 3,
            errMessage: `Seat ${s.seatId} is not available`,
          };
        }

        await db.BookingSeats.create(
          {
            bookingId: newBooking.id,
            seatId: s.seatId,
            price: s.price,
          },
          { transaction: t }
        );

        await db.Seat.update(
          { status: "HOLD" },
          { where: { id: s.seatId }, transaction: t }
        );
      }
    }

    await t.commit();
    return {
      errCode: 0,
      errMessage: "Booking created successfully",
      data: newBooking,
    };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

/**
 * Cập nhật trạng thái booking
 */
let updateBookingStatus = async (bookingId, status) => {
  const t = await db.sequelize.transaction();
  try {
    if (!bookingId || !status) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    const booking = await db.Bookings.findOne({
      where: { id: bookingId },
      transaction: t,
    });
    if (!booking) {
      await t.rollback();
      return { errCode: 2, errMessage: "Booking not found" };
    }

    await db.Bookings.update(
      { status },
      { where: { id: bookingId }, transaction: t }
    );

    // Sync seat status
    const bookingSeats = await db.BookingSeats.findAll({
      where: { bookingId },
      transaction: t,
    });

    if (status === "CONFIRMED") {
      for (let bs of bookingSeats) {
        await db.Seat.update(
          { status: "SOLD" },
          { where: { id: bs.seatId }, transaction: t }
        );
      }
    } else if (status === "CANCELLED") {
      for (let bs of bookingSeats) {
        await db.Seat.update(
          { status: "AVAILABLE" },
          { where: { id: bs.seatId }, transaction: t }
        );
      }
    }

    await t.commit();
    return { errCode: 0, errMessage: "Booking status updated successfully" };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

/**
 * Xoá booking
 */
let deleteBooking = async (bookingId) => {
  const t = await db.sequelize.transaction();
  try {
    const booking = await db.Bookings.findOne({ where: { id: bookingId } });
    if (!booking) {
      return { errCode: 2, errMessage: "Booking doesn't exist" };
    }

    await db.BookingCustomers.destroy({ where: { bookingId }, transaction: t });
    await db.BookingPoints.destroy({ where: { bookingId }, transaction: t });
    await db.BookingSeats.destroy({ where: { bookingId }, transaction: t });
    await db.BookingPayments.destroy({ where: { bookingId }, transaction: t });
    await db.Bookings.destroy({ where: { id: bookingId }, transaction: t });

    await t.commit();
    return { errCode: 0, errMessage: "Booking deleted successfully" };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export default {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
