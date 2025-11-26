// src/services/bookingManageServices/bookingPaymentService.js
import db from "../../models/index.js";
import emailServices from "../emailServices.js";

// Lấy tất cả payment
let getAllPayments = async () => {
  try {
    const payments = await db.BookingPayments.findAll({
      include: [
        {
          model: db.Bookings,
          as: "booking",
          attributes: ["id", "bookingCode", "status", "totalAmount"],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data: payments };
  } catch (e) {
    throw e;
  }
};

// Tạo payment mới
let createPayment = async (data, t) => {
  const payment = await db.BookingPayments.create(
    {
      bookingId: data.bookingId,
      method: data.method,
      status: "PENDING",
      amount: data.amount,
      transactionCode: data.transactionCode || null,
      paidAt: null,
    },
    { transaction: t }
  );

  // Nếu thanh toán tiền mặt hoặc banking → xác nhận ngay
  if (["CASH", "BANKING"].includes(data.method)) {
    await db.Bookings.update(
      { status: "CONFIRMED" },
      { where: { id: data.bookingId }, transaction: t }
    );

    // pdate BookingSeats
    await db.BookingSeats.update(
      { status: "SOLD" },
      { where: { bookingId: data.bookingId }, transaction: t }
    );
  }

  return {
    errCode: 0,
    errMessage: "Payment created successfully",
    data: payment,
  };
};

// Lấy payment theo bookingId
let getPaymentByBooking = async (bookingId) => {
  try {
    const payment = await db.BookingPayments.findAll({
      where: { bookingId },
      raw: true,
    });

    return { errCode: 0, errMessage: "OK", data: payment };
  } catch (e) {
    throw e;
  }
};

// Cập nhật trạng thái payment
let updatePaymentStatus = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    if (!data.paymentId || !data.status) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    const payment = await db.BookingPayments.findOne({
      where: { id: data.paymentId },
      transaction: t,
    });
    if (!payment) {
      await t.rollback();
      return { errCode: 2, errMessage: "Payment not found" };
    }

    // Cập nhật trạng thái payment
    await db.BookingPayments.update(
      {
        status: data.status,
        transactionCode: data.transactionCode || payment.transactionCode,
        paidAt: data.status === "SUCCESS" ? new Date() : null,
      },
      { where: { id: data.paymentId }, transaction: t }
    );

    //  hủy booking + đánh dấu ghế CANCELLED
    if (data.status === "FAILED") {
      await db.Bookings.update(
        { status: "CANCELLED" },
        { where: { id: payment.bookingId }, transaction: t }
      );

      await db.BookingSeats.update(
        { status: "CANCELLED" },
        { where: { bookingId: payment.bookingId }, transaction: t }
      );
    }

    if (data.status === "SUCCESS") {
      const booking = await db.Bookings.findOne({
        where: { id: payment.bookingId },
        include: [
          {
            model: db.BookingCustomers,
            as: "customers",
            attributes: ["fullName", "email"],
          },
          {
            model: db.BookingSeats,
            as: "seats",
            include: [
              { model: db.Seat, as: "seat", attributes: ["name", "floor"] },
            ],
          },
          {
            model: db.BookingPoints,
            as: "points",
            include: [
              {
                model: db.Location,
                as: "Location",
                attributes: ["nameLocations"],
              },
            ],
          },
          {
            model: db.CoachTrip,
            as: "trip",
            include: [
              {
                model: db.Vehicle,
                as: "vehicle",
                attributes: ["name", "licensePlate"],
              },
            ],
          },
        ],
        transaction: t,
        raw: false,
      });

      await db.Bookings.update(
        { status: "CONFIRMED" },
        { where: { id: payment.bookingId }, transaction: t }
      );

      // Update trạng thái ghế sang SOLD
      await db.BookingSeats.update(
        { status: "SOLD" },
        { where: { bookingId: payment.bookingId }, transaction: t }
      );

      // Gửi email xác nhận
      const mainCustomer = booking.customers?.[0];
      if (mainCustomer?.email) {
        const pickup = booking.points.find((p) => p.type === "PICKUP");
        const dropoff = booking.points.find((p) => p.type === "DROPOFF");
        const vehicleName = booking.trip?.vehicle?.name || "Không rõ";
        const licensePlate = booking.trip?.vehicle?.licensePlate || "Không rõ";

        await emailServices.sendPaymentSuccessEmail({
          receiverEmail: mainCustomer.email,
          fullName: mainCustomer.fullName,
          bookingCode: booking.bookingCode,
          totalAmount: booking.totalAmount,
          method: payment.method,
          seats: booking.seats.map(
            (s) => `${s.seat?.name} (Tầng ${s.seat?.floor})`
          ),
          pickup: pickup?.Location?.nameLocations,
          dropoff: dropoff?.Location?.nameLocations,
          vehicleName,
          licensePlate,
        });
      }
    }

    await t.commit();
    return { errCode: 0, errMessage: "Payment updated successfully" };
  } catch (e) {
    await t.rollback();
    console.error("updatePaymentStatus error:", e);
    throw e;
  }
};

export default {
  getAllPayments,
  createPayment,
  getPaymentByBooking,
  updatePaymentStatus,
};
