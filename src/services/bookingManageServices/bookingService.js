// src/services/bookingManageServices/bookingService.js
import db from "../../models/index.js";
import paymentService from "../bookingManageServices/bookingPaymentService.js";

// Lấy danh sách tất cả vé đặt
let getAllBookings = async (userId = null) => {
  try {
    const whereCondition = userId ? { userId } : {};

    const bookings = await db.Bookings.findAll({
      where: whereCondition,
      include: [
        {
          model: db.BookingCustomers,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          as: "customers",
        },
        {
          model: db.BookingPoints,
          as: "points",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Location,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              as: "Location",
            },
          ],
        },
        {
          model: db.BookingSeats,
          as: "seats",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Seat,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              as: "seat",
            },
          ],
        },
        {
          model: db.BookingPayments,
          as: "payment",
          attributes: [
            "method",
            "status",
            "amount",
            "transactionCode",
            "paidAt",
          ],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: {
                exclude: ["imageRouteCoach", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: db.Location,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                  as: "fromLocation",
                },
                {
                  model: db.Location,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                  as: "toLocation",
                },
              ],
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      errMessage: "Lấy danh sách vé đặt thành công",
      data: bookings,
    };
  } catch (e) {
    console.error("getAllBookings error:", e);
    throw e;
  }
};

// Lấy chi tiết một vé đặt theo id
let getBookingById = async (bookingId) => {
  try {
    if (!bookingId) {
      return {
        errCode: 1,
        errMessage: "Thiếu tham số bookingId",
        data: null,
      };
    }

    const booking = await db.Bookings.findOne({
      where: { id: bookingId },
      include: [
        {
          model: db.BookingCustomers,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          as: "customers",
        },
        {
          model: db.BookingPoints,
          as: "points",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Location,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              as: "Location",
            },
          ],
        },
        {
          model: db.BookingSeats,
          as: "seats",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Seat,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              as: "seat",
            },
          ],
        },
        { model: db.BookingPayments, as: "payment" },
        {
          model: db.CoachTrip,
          as: "trip",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: {
                exclude: ["imageRouteCoach", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: db.Location,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                  as: "fromLocation",
                },
                {
                  model: db.Location,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                  as: "toLocation",
                },
              ],
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!booking)
      return {
        errCode: 2,
        errMessage: "Không tìm thấy vé đặt",
        data: null,
      };

    return {
      errCode: 0,
      errMessage: "Lấy thông tin vé đặt thành công",
      data: booking,
    };
  } catch (e) {
    throw e;
  }
};

// Sinh mã đặt vé dạng BKYYYYMMDDxxxx
const generateBookingCode = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK${y}${m}${d}${rand}`;
};

// Tạo mới một vé đặt kèm khách, điểm đón/trả, ghế, thanh toán
let createBooking = async (data) => {
  // Kiểm tra dữ liệu đầu vào trước khi mở transaction
  if (!data.coachTripId || !data.seats || !data.totalAmount) {
    return { errCode: 1, errMessage: "Thiếu tham số bắt buộc" };
  }

  const t = await db.sequelize.transaction();
  try {
    const bookingCode = generateBookingCode();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000); // hết hạn sau 10 phút

    // Tạo booking chính
    const newBooking = await db.Bookings.create(
      {
        userId: data.userId || null,
        coachTripId: data.coachTripId,
        status: "PENDING",
        totalAmount: data.totalAmount,
        bookingCode,
        expiredAt: expireAt,
      },
      { transaction: t }
    );

    // Lưu danh sách hành khách
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

    // Lưu điểm đón / trả khách
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

    // Giữ ghế (HOLD) và kiểm tra trùng
    if (data.seats?.length > 0) {
      for (let s of data.seats) {
        const seat = await db.Seat.findByPk(s.seatId, { transaction: t });
        if (!seat) {
          await t.rollback();
          return {
            errCode: 2,
            errMessage: `Không tìm thấy ghế với id ${s.seatId}`,
          };
        }

        const existing = await db.BookingSeats.findOne({
          where: {
            seatId: s.seatId,
            tripId: data.coachTripId,
            status: ["HOLD", "SOLD"],
          },
          transaction: t,
        });
        if (existing) {
          await t.rollback();
          return {
            errCode: 3,
            errMessage: `Ghế ${seat.name} đã được đặt cho chuyến này`,
          };
        }

        await db.BookingSeats.create(
          {
            bookingId: newBooking.id,
            seatId: s.seatId,
            tripId: data.coachTripId,
            price: s.price,
            status: "HOLD",
          },
          { transaction: t }
        );
      }
    }

    // Tạo bản ghi thanh toán nếu chọn thanh toán tiền mặt
    if (data.paymentMethod === "CASH") {
      await paymentService.createPayment(
        {
          bookingId: newBooking.id,
          method: "CASH",
          amount: data.totalAmount,
        },
        t
      );
    }

    await t.commit();
    return {
      errCode: 0,
      errMessage: "Tạo vé đặt thành công",
      data: newBooking,
    };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

// Cập nhật trạng thái vé đặt và trạng thái ghế tương ứng
let updateBookingStatus = async (bookingId, status) => {
  // Kiểm tra đầu vào trước
  if (!bookingId || !status) {
    return { errCode: 1, errMessage: "Thiếu tham số bắt buộc" };
  }

  const t = await db.sequelize.transaction();
  try {
    const booking = await db.Bookings.findByPk(bookingId, { transaction: t });
    if (!booking) {
      await t.rollback();
      return { errCode: 2, errMessage: "Không tìm thấy vé đặt" };
    }

    // Cập nhật trạng thái chính của booking
    await db.Bookings.update(
      { status },
      { where: { id: bookingId }, transaction: t }
    );

    // Cập nhật trạng thái ghế theo trạng thái booking
    const bookingSeats = await db.BookingSeats.findAll({
      where: { bookingId },
      transaction: t,
    });

    if (status === "CONFIRMED") {
      for (let bs of bookingSeats) {
        await bs.update({ status: "SOLD" }, { transaction: t });
      }
    } else if (status === "CANCELLED") {
      for (let bs of bookingSeats) {
        await bs.update({ status: "CANCELLED" }, { transaction: t });
      }
    }

    await t.commit();
    return {
      errCode: 0,
      errMessage: "Cập nhật trạng thái vé đặt thành công",
    };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

// Xóa vé đặt và toàn bộ dữ liệu liên quan
let deleteBooking = async (bookingId) => {
  try {
    const booking = await db.Bookings.findByPk(bookingId);
    if (!booking) {
      return { errCode: 2, errMessage: "Vé đặt không tồn tại" };
    }

    const t = await db.sequelize.transaction();
    try {
      await db.BookingCustomers.destroy({
        where: { bookingId },
        transaction: t,
      });
      await db.BookingPoints.destroy({ where: { bookingId }, transaction: t });
      await db.BookingSeats.destroy({ where: { bookingId }, transaction: t });
      await db.BookingPayments.destroy({
        where: { bookingId },
        transaction: t,
      });
      await db.Bookings.destroy({ where: { id: bookingId }, transaction: t });

      await t.commit();
      return { errCode: 0, errMessage: "Xóa vé đặt thành công" };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } catch (e) {
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
