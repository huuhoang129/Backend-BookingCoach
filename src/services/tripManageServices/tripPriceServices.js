import db from "../../models/index.js";

// Lấy tất cả TripPrices
let getAllTripPrices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let prices = await db.TripPrices.findAll({
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
        errMessage: "OK",
        data: prices,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy TripPrice theo ID
let getTripPriceById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      let price = await db.TripPrices.findOne({
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
          errMessage: "TripPrice not found",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: price,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createTripPrice = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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
            "Giá vé cho tuyến, loại ghế và loại chuyến này đã tồn tại!",
        });
      }

      // 🟢 Tạo mới nếu chưa có
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

// Cập nhật TripPrice
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
          errMessage: "Missing required parameters",
        });
      }

      let price = await db.TripPrices.findOne({ where: { id: data.id } });
      if (!price) {
        return resolve({
          errCode: 2,
          errMessage: "TripPrice not found",
        });
      }

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
        errMessage: "TripPrice updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa TripPrice
let deleteTripPrice = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let price = await db.TripPrices.findOne({ where: { id } });
      if (!price) {
        return resolve({
          errCode: 2,
          errMessage: "TripPrice doesn't exist",
        });
      }

      await db.TripPrices.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "TripPrice deleted successfully",
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
