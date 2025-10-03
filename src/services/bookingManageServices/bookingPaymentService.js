import db from "../../models/index.js";
import emailServices from "../emailServices.js";

let getAllPayments = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let payments = await db.BookingPayments.findAll({
        include: [
          {
            model: db.Bookings,
            as: "booking",
            attributes: ["id", "status", "totalAmount"],
          },
        ],
        order: [["createdAt", "DESC"]],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: payments,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createPayment = async (data, t) => {
  let payment = await db.BookingPayments.create(
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

  if (["CASH", "BANKING"].includes(data.method)) {
    await db.Bookings.update(
      { status: "CONFIRMED" },
      { where: { id: data.bookingId }, transaction: t }
    );

    let bookingSeats = await db.BookingSeats.findAll({
      where: { bookingId: data.bookingId },
      transaction: t,
    });

    for (let bs of bookingSeats) {
      await db.Seat.update(
        { status: "SOLD" },
        { where: { id: bs.seatId }, transaction: t }
      );
    }
  }

  return payment;
};

let getPaymentByBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let payment = await db.BookingPayments.findAll({
        where: { bookingId },
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: payment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updatePaymentStatus = (data) => {
  return new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
      if (!data.paymentId || !data.status) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      // Lấy payment record
      let payment = await db.BookingPayments.findOne({
        where: { id: data.paymentId },
        transaction: t,
      });

      if (!payment) {
        await t.rollback();
        return resolve({ errCode: 2, errMessage: "Payment not found" });
      }

      // Cập nhật trạng thái payment
      await db.BookingPayments.update(
        {
          status: data.status,
          transactionCode: data.transactionCode || null,
          paidAt: data.status === "SUCCESS" ? new Date().toISOString() : null,
        },
        { where: { id: data.paymentId }, transaction: t }
      );

      // Nếu FAILED thì huỷ booking + trả lại ghế
      if (data.status === "FAILED") {
        await db.Bookings.update(
          { status: "CANCELLED" },
          { where: { id: payment.bookingId }, transaction: t }
        );

        let bookingSeats = await db.BookingSeats.findAll({
          where: { bookingId: payment.bookingId },
          transaction: t,
        });

        for (let bs of bookingSeats) {
          await db.Seat.update(
            { status: "available" }, // ❗ nhớ đúng enum của bạn (available / selected / sold)
            { where: { id: bs.seatId }, transaction: t }
          );
        }
      }

      // Nếu SUCCESS thì confirm booking + gửi email
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
                {
                  model: db.Seat,
                  as: "seat",
                  attributes: ["name", "floor"],
                },
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
          ],
          transaction: t,
          raw: false, // ✅ không dùng raw ở đây
        });

        // Cập nhật booking -> CONFIRMED
        await db.Bookings.update(
          { status: "CONFIRMED" },
          { where: { id: payment.bookingId }, transaction: t }
        );

        // Lấy khách chính (giả sử khách đầu tiên là chính)
        const mainCustomer = booking.customers?.[0];
        if (mainCustomer && mainCustomer.email) {
          const pickup = booking.points.find((p) => p.type === "PICKUP");
          const dropoff = booking.points.find((p) => p.type === "DROPOFF");

          // Gửi email
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
          });
        }
      }

      await t.commit();
      resolve({ errCode: 0, errMessage: "Payment updated successfully" });
    } catch (e) {
      await t.rollback();
      console.error("updatePaymentStatus error:", e);
      reject(e);
    }
  });
};

export default {
  getAllPayments,
  createPayment,
  getPaymentByBooking,
  updatePaymentStatus,
};
