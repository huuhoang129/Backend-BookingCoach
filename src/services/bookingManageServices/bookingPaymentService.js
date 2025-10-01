import db from "../../models/index.js";

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

      let payment = await db.BookingPayments.findOne({
        where: { id: data.paymentId },
        transaction: t,
      });

      if (!payment) {
        await t.rollback();
        return resolve({ errCode: 2, errMessage: "Payment not found" });
      }

      // Cập nhật payment record
      await db.BookingPayments.update(
        {
          status: data.status,
          transactionCode: data.transactionCode || null,
          paidAt: data.status === "SUCCESS" ? new Date().toISOString() : null,
        },
        { where: { id: data.paymentId }, transaction: t }
      );

      // 👉 Nếu FAILED thì reset booking + seats
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
            { status: "AVAILABLE" },
            { where: { id: bs.seatId }, transaction: t }
          );
        }
      }

      // 👉 Nếu SUCCESS thì giữ nguyên (CASH/BANKING đã CONFIRMED + SOLD ở createPayment)
      if (data.status === "SUCCESS") {
        await db.Bookings.update(
          { status: "CONFIRMED" },
          { where: { id: payment.bookingId }, transaction: t }
        );
      }

      await t.commit();
      resolve({ errCode: 0, errMessage: "Payment updated successfully" });
    } catch (e) {
      await t.rollback();
      reject(e);
    }
  });
};

export default {
  createPayment,
  getPaymentByBooking,
  updatePaymentStatus,
};
