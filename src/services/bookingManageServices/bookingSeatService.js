import db from "../../models/index.js";

// Lấy danh sách ghế theo bookingId
let getSeatsByBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: bookingId",
        });
      }

      let seats = await db.BookingSeats.findAll({
        where: { bookingId },
        include: [
          {
            model: db.Seat,
            as: "seat",
          },
        ],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: seats,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Thêm ghế cho booking
let addSeat = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.seatId || !data.price) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      let seat = await db.BookingSeats.create({
        bookingId: data.bookingId,
        seatId: data.seatId,
        price: data.price,
      });

      resolve({
        errCode: 0,
        errMessage: "Seat added successfully",
        data: seat,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật ghế (trong trường hợp đổi ghế, update giá)
let updateSeat = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.seatId || !data.price) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      const [updated] = await db.BookingSeats.update(
        {
          seatId: data.seatId,
          price: data.price,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({ errCode: 2, errMessage: "Seat not found" });
      }

      resolve({
        errCode: 0,
        errMessage: "Seat updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa ghế
let deleteSeat = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let seat = await db.BookingSeats.findOne({ where: { id } });
      if (!seat) {
        return resolve({
          errCode: 2,
          errMessage: "Seat not found",
        });
      }

      await db.BookingSeats.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Seat deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getSeatsByBooking,
  addSeat,
  updateSeat,
  deleteSeat,
};
