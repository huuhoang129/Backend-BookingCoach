import db from "../../models/index.js";
import { Op, Sequelize } from "sequelize";

// Báo cáo doanh thu theo khoảng thời gian (groupBy: day | month | year)
let getRevenueReport = async (from, to, groupBy = "day") => {
  try {
    if (!from || !to) {
      return {
        errCode: 1,
        errMessage: "Thiếu tham số from/to",
        data: [],
      };
    }

    // Xác định cách nhóm dữ liệu theo thời gian
    let groupExpr;
    if (groupBy === "month") {
      groupExpr = Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-01')`);
    } else if (groupBy === "year") {
      groupExpr = Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-01-01')`);
    } else {
      groupExpr = Sequelize.literal(`DATE(createdAt)`);
    }

    // Truy vấn doanh thu
    const revenue = await db.Bookings.findAll({
      attributes: [
        [groupExpr, "date"],
        [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
      ],
      where: {
        status: "CONFIRMED",
        createdAt: {
          [Op.between]: [
            new Date(`${from}T00:00:00`),
            new Date(`${to}T23:59:59`),
          ],
        },
      },
      group: [groupExpr],
      order: [[Sequelize.literal("date"), "ASC"]],
      raw: true,
    });

    return {
      errCode: 0,
      errMessage: "Thống kê doanh thu thành công",
      data: revenue.map((r) => ({
        date: r.date,
        totalRevenue: Number(r.totalRevenue),
      })),
    };
  } catch (e) {
    console.error("getRevenueReport error:", e);
    return {
      errCode: 2,
      errMessage: "Lỗi máy chủ",
      data: [],
    };
  }
};

// Báo cáo số lượng vé bán ra theo thời gian
let getTicketSalesReport = async (from, to, groupBy = "day") => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!from || !to) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số from/to",
          data: [],
        });
      }

      // Xác định cách nhóm dữ liệu
      let groupExpr;
      if (groupBy === "month") {
        groupExpr = Sequelize.literal(
          `DATE_FORMAT(booking.createdAt, '%Y-%m-01')`
        );
      } else if (groupBy === "year") {
        groupExpr = Sequelize.literal(
          `DATE_FORMAT(booking.createdAt, '%Y-01-01')`
        );
      } else {
        groupExpr = Sequelize.literal(`DATE(booking.createdAt)`);
      }

      // Truy vấn số vé bán ra
      const sales = await db.BookingSeats.findAll({
        attributes: [
          [groupExpr, "date"],
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
            where: {
              status: "CONFIRMED",
              createdAt: {
                [Op.between]: [
                  new Date(`${from}T00:00:00`),
                  new Date(`${to}T23:59:59`),
                ],
              },
            },
          },
        ],
        group: [groupExpr],
        order: [[Sequelize.literal("date"), "ASC"]],
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Thống kê vé bán ra thành công",
        data: sales.map((s) => ({
          date: s.date,
          ticketsSold: Number(s.ticketsSold),
        })),
      });
    } catch (e) {
      console.error("getTicketSalesReport error:", e);
      reject({
        errCode: 2,
        errMessage: "Lỗi máy chủ",
        data: [],
      });
    }
  });
};

// Báo cáo tỷ lệ hủy vé theo thời gian
let getCancellationRateReport = async (from, to, groupBy = "day") => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!from || !to) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số from/to",
          data: [],
        });
      }

      // Xác định cách nhóm dữ liệu
      let groupExpr;
      if (groupBy === "month") {
        groupExpr = Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-01')`);
      } else if (groupBy === "year") {
        groupExpr = Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-01-01')`);
      } else {
        groupExpr = Sequelize.literal(`DATE(createdAt)`);
      }

      // Tổng số bookings theo nhóm
      const total = await db.Bookings.findAll({
        attributes: [
          [groupExpr, "date"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "totalBookings"],
        ],
        where: {
          createdAt: {
            [Op.between]: [
              new Date(`${from}T00:00:00`),
              new Date(`${to}T23:59:59`),
            ],
          },
        },
        group: [groupExpr],
        raw: true,
      });

      // Số bookings bị hủy theo nhóm
      const cancelled = await db.Bookings.findAll({
        attributes: [
          [groupExpr, "date"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "cancelledBookings"],
        ],
        where: {
          status: "CANCELLED",
          createdAt: {
            [Op.between]: [
              new Date(`${from}T00:00:00`),
              new Date(`${to}T23:59:59`),
            ],
          },
        },
        group: [groupExpr],
        raw: true,
      });

      // Map nhanh dữ liệu bị hủy theo từng nhóm
      const cancelledMap = new Map(
        cancelled.map((c) => [c.date, Number(c.cancelledBookings)])
      );

      // Gom dữ liệu thành lịch sử theo từng mốc thời gian
      const history = total.map((t) => {
        const totalBookings = Number(t.totalBookings);
        const cancelledBookings = cancelledMap.get(t.date) || 0;

        return {
          date: t.date,
          total: totalBookings,
          cancelled: cancelledBookings,
        };
      });

      // Tính tổng và tỷ lệ hủy chung
      const overallTotal = history.reduce((sum, cur) => sum + cur.total, 0);
      const overallCancelled = history.reduce(
        (sum, cur) => sum + cur.cancelled,
        0
      );
      const overallRate =
        overallTotal > 0 ? (overallCancelled / overallTotal) * 100 : 0;

      resolve({
        errCode: 0,
        errMessage: "Thống kê tỷ lệ hủy vé thành công",
        data: {
          totalBookings: overallTotal,
          cancelledBookings: overallCancelled,
          cancellationRate: Number(overallRate.toFixed(2)),
          history, // dữ liệu cho biểu đồ
        },
      });
    } catch (e) {
      console.error("getCancellationRateReport error:", e);
      reject(e);
    }
  });
};

export default {
  getRevenueReport,
  getTicketSalesReport,
  getCancellationRateReport,
};
