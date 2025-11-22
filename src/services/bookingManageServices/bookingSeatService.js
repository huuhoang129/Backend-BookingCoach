import db from "../../models/index.js";

// 🔹 Lấy danh sách ghế theo bookingId
let getSeatsByBooking = async (bookingId) => {
  try {
    if (!bookingId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter: bookingId",
      };
    }

    const seats = await db.BookingSeats.findAll({
      where: { bookingId },
      include: [
        { model: db.Seat, as: "seat" },
        { model: db.CoachTrip, as: "trip" },
      ],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data: seats };
  } catch (e) {
    throw e;
  }
};

// 🔹 Thêm ghế cho booking
let addSeat = async (data) => {
  try {
    if (!data.bookingId || !data.seatId || !data.price || !data.tripId) {
      return {
        errCode: 1,
        errMessage:
          "Missing required parameters (bookingId, seatId, tripId, price)",
      };
    }

    // ✅ Kiểm tra ghế đã được đặt trong cùng chuyến chưa
    const exists = await db.BookingSeats.findOne({
      where: {
        seatId: data.seatId,
        tripId: data.tripId,
        status: ["HOLD", "SOLD"],
      },
    });
    if (exists) {
      return {
        errCode: 2,
        errMessage: "Seat already booked for this trip",
      };
    }

    const seat = await db.BookingSeats.create({
      bookingId: data.bookingId,
      seatId: data.seatId,
      tripId: data.tripId,
      price: data.price,
      status: "HOLD", // ✅ giữ ghế tạm thời
    });

    return {
      errCode: 0,
      errMessage: "Seat added successfully",
      data: seat,
    };
  } catch (e) {
    throw e;
  }
};

// 🔹 Cập nhật ghế (ví dụ đổi ghế)
let updateSeat = async (data) => {
  try {
    if (!data.id || !data.seatId || !data.price) {
      return {
        errCode: 1,
        errMessage: "Missing required parameters (id, seatId, price)",
      };
    }

    const [updated] = await db.BookingSeats.update(
      {
        seatId: data.seatId,
        price: data.price,
      },
      { where: { id: data.id } }
    );

    if (updated === 0) {
      return { errCode: 2, errMessage: "Seat not found" };
    }

    return { errCode: 0, errMessage: "Seat updated successfully" };
  } catch (e) {
    throw e;
  }
};

// 🔹 Xóa ghế
let deleteSeat = async (id) => {
  try {
    const seat = await db.BookingSeats.findByPk(id);
    if (!seat) {
      return { errCode: 2, errMessage: "Seat not found" };
    }

    await db.BookingSeats.destroy({ where: { id } });

    return { errCode: 0, errMessage: "Seat deleted successfully" };
  } catch (e) {
    throw e;
  }
};

export default {
  getSeatsByBooking,
  addSeat,
  updateSeat,
  deleteSeat,
};
