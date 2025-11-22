// src/services/bookingManageServices/bookingPointService.js
import db from "../../models/index.js";

// Lấy danh sách điểm đón/trả theo bookingId
let getPointsByBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số: bookingId",
        });
      }

      // Lấy danh sách điểm đón/trả + kèm thông tin Location
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
        errMessage: "Lấy danh sách thành công",
        data: points,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Thêm điểm đón/trả mới
let addPoint = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.type || !data.locationId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Tạo mới điểm đón/trả
      let point = await db.BookingPoints.create({
        bookingId: data.bookingId,
        type: data.type, // PICKUP hoặc DROPOFF
        locationId: data.locationId,
        time: data.time || null,
        note: data.note || null,
      });

      resolve({
        errCode: 0,
        errMessage: "Thêm điểm thành công",
        data: point,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin điểm đón/trả
let updatePoint = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.type || !data.locationId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Cập nhật dựa theo id
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
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy điểm để cập nhật",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Cập nhật thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa điểm đón/trả theo id
let deletePoint = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra điểm có tồn tại không
      let point = await db.BookingPoints.findOne({ where: { id } });
      if (!point) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy điểm để xóa",
        });
      }

      // Xóa điểm
      await db.BookingPoints.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Xóa điểm thành công",
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
