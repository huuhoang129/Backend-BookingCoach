import db from "../../models/index.js";
import { Sequelize } from "sequelize";

// Doanh thu theo ngày
let getRevenueReport = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let revenue = await db.Bookings.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
        ],
        where: { status: "CONFIRMED" },
        group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
        order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
        raw: true,
      });

      resolve({ errCode: 0, errMessage: "OK", data: revenue });
    } catch (e) {
      reject(e);
    }
  });
};

// Số lượng vé bán ra
let getTicketSalesReport = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sales = await db.BookingSeats.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("booking.createdAt")), "date"],
          [
            Sequelize.fn("COUNT", Sequelize.col("BookingSeats.id")),
            "ticketsSold",
          ],
        ],
        include: [
          {
            model: db.Bookings,
            as: "booking",
            attributes: [],
            where: { status: "CONFIRMED" },
          },
        ],
        group: [Sequelize.fn("DATE", Sequelize.col("booking.createdAt"))],
        order: [
          [Sequelize.fn("DATE", Sequelize.col("booking.createdAt")), "ASC"],
        ],
        raw: true,
      });

      resolve({ errCode: 0, errMessage: "OK", data: sales });
    } catch (e) {
      reject(e);
    }
  });
};

// Tỷ lệ hủy vé
let getCancellationRateReport = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalBookings = await db.Bookings.count();
      let cancelledBookings = await db.Bookings.count({
        where: { status: "CANCELLED" },
      });

      let rate =
        totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: {
          totalBookings,
          cancelledBookings,
          cancellationRate: rate.toFixed(2),
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getRevenueReport,
  getTicketSalesReport,
  getCancellationRateReport,
};
