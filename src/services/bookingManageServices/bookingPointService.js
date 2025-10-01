import db from "../../models/index.js";

// Lấy điểm đón/trả theo bookingId
let getPointsByBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: bookingId",
        });
      }

      let points = await db.BookingPoints.findAll({
        where: { bookingId },
        include: [
          {
            model: db.Location,
            as: "Location",
          },
        ],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: points,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Thêm điểm đón/trả
let addPoint = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.type || !data.locationId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      let point = await db.BookingPoints.create({
        bookingId: data.bookingId,
        type: data.type, // PICKUP hoặc DROPOFF
        locationId: data.locationId,
        time: data.time || null,
        note: data.note || null,
      });

      resolve({
        errCode: 0,
        errMessage: "Point added successfully",
        data: point,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật điểm đón/trả
let updatePoint = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.type || !data.locationId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      const [updated] = await db.BookingPoints.update(
        {
          type: data.type,
          locationId: data.locationId,
          time: data.time,
          note: data.note,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({ errCode: 2, errMessage: "Point not found" });
      }

      resolve({
        errCode: 0,
        errMessage: "Point updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa điểm đón/trả
let deletePoint = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let point = await db.BookingPoints.findOne({ where: { id } });
      if (!point) {
        return resolve({
          errCode: 2,
          errMessage: "Point not found",
        });
      }

      await db.BookingPoints.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Point deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getPointsByBooking,
  addPoint,
  updatePoint,
  deletePoint,
};
