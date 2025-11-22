// src/services/tripManageServices/tripPriceServices.js
import db from "../../models/index.js";

// Lấy toàn bộ danh sách giá vé theo tuyến
let getAllTripPrices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const prices = await db.TripPrices.findAll({
        include: [
          {
            model: db.CoachRoute,
            as: "route",
            include: [
              {
                model: db.Location,
                as: "fromLocation",
                include: [{ model: db.Province, as: "province" }],
              },
              {
                model: db.Location,
                as: "toLocation",
                include: [{ model: db.Province, as: "province" }],
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách giá vé thành công",
        data: prices,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy giá vé theo ID
let getTripPriceById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc: id",
        });
      }

      const price = await db.TripPrices.findOne({
        where: { id },
        include: [
          {
            model: db.CoachRoute,
            as: "route",
          },
        ],
        raw: false,
        nest: true,
      });

      if (!price) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy giá vé",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Lấy thông tin giá vé thành công",
        data: price,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới giá vé
let createTripPrice = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra tham số đầu vào
      if (
        !data.coachRouteId ||
        !data.seatType ||
        !data.priceTrip ||
        !data.typeTrip
      ) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Kiểm tra trùng giá vé
      const existing = await db.TripPrices.findOne({
        where: {
          coachRouteId: data.coachRouteId,
          seatType: data.seatType,
          typeTrip: data.typeTrip,
        },
      });

      if (existing) {
        return resolve({
          errCode: 2,
          errMessage:
            "Giá vé cho tuyến, loại ghế và loại chuyến này đã tồn tại",
        });
      }

      // Tạo mới giá vé
      await db.TripPrices.create({
        coachRouteId: data.coachRouteId,
        seatType: data.seatType,
        priceTrip: data.priceTrip,
        typeTrip: data.typeTrip,
      });

      resolve({
        errCode: 0,
        errMessage: "Tạo giá vé thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật giá vé
let updateTripPrice = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.coachRouteId ||
        !data.seatType ||
        !data.priceTrip ||
        !data.typeTrip
      ) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Kiểm tra tồn tại giá vé
      const price = await db.TripPrices.findOne({ where: { id: data.id } });
      if (!price) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy giá vé cần cập nhật",
        });
      }

      // Cập nhật giá vé
      await db.TripPrices.update(
        {
          coachRouteId: data.coachRouteId,
          seatType: data.seatType,
          priceTrip: data.priceTrip,
          typeTrip: data.typeTrip,
        },
        { where: { id: data.id } }
      );

      resolve({
        errCode: 0,
        errMessage: "Cập nhật giá vé thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa giá vé
let deleteTripPrice = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const price = await db.TripPrices.findOne({ where: { id } });
      if (!price) {
        return resolve({
          errCode: 2,
          errMessage: "Giá vé không tồn tại",
        });
      }

      // Xóa giá vé
      await db.TripPrices.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Xóa giá vé thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllTripPrices,
  getTripPriceById,
  createTripPrice,
  updateTripPrice,
  deleteTripPrice,
};
