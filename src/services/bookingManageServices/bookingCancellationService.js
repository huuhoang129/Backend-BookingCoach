//src/services/bookingManageServices/bookingCancellationService.js
import db from "../../models/index.js";

// Tạo mới yêu cầu hoàn hủy
let createCancellation = async (data) => {
  try {
    // 0. Lấy booking + trip
    const booking = await db.Bookings.findOne({
      where: {
        bookingCode: data.bookingCode,
        userId: data.userId,
      },
      include: [
        {
          model: db.CoachTrip,
          as: "trip",
          attributes: ["status", "startDate", "startTime"],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!booking) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy booking",
        data: null,
      };
    }

    // 1. Kiểm tra trạng thái chuyến
    if (booking.trip.status === "FULL") {
      return {
        errCode: 3,
        errMessage: "Chuyến xe đã chạy, không thể hủy vé",
        data: null,
      };
    }

    if (booking.trip.status === "CANCELLED") {
      return {
        errCode: 4,
        errMessage: "Chuyến xe đã bị hủy",
        data: null,
      };
    }

    // 2. Kiểm tra trùng yêu cầu
    const existed = await db.BookingCancellation.findOne({
      where: {
        bookingCode: data.bookingCode,
        userId: data.userId,
      },
      raw: true,
    });

    if (existed) {
      return {
        errCode: 2,
        errMessage: "Bạn đã gửi yêu cầu hủy vé cho booking này rồi",
        data: existed,
      };
    }

    // 3. Tạo yêu cầu hủy
    const record = await db.BookingCancellation.create({
      bookingCode: data.bookingCode,
      userId: data.userId,
      title: data.title,
      reason: data.reason,
      refundMethod: data.refundMethod || "CASH",
      bankName: data.bankName || null,
      bankNumber: data.bankNumber || null,
    });

    return {
      errCode: 0,
      errMessage: "Yêu cầu hủy vé đã được gửi",
      data: record,
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi server",
      data: null,
    };
  }
};

// Lấy danh sách hoàn hủy
let getAllCancellations = async () => {
  try {
    const records = await db.BookingCancellation.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });
    return {
      errCode: 0,
      errMessage: "Lấy danh sách yêu cầu thành công",
      data: records,
    };
  } catch (e) {
    console.log("Get all error:", e);
    return { errCode: -1, errMessage: "Lỗi server", data: null };
  }
};

// Lấy danh sách hoàn hủy theo id
let getCancellationById = async (id) => {
  try {
    const record = await db.BookingCancellation.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!record)
      return { errCode: 1, errMessage: "Không tìm thấy yêu cầu", data: null };
    return { errCode: 0, errMessage: "OK", data: record };
  } catch (e) {
    console.log("Get by ID error:", e);
    return { errCode: -1, errMessage: "Lỗi server", data: null };
  }
};

// Cập nhật bản ghi hoàn hủy
let updateCancellation = async (id, payload) => {
  try {
    const record = await db.BookingCancellation.findOne({
      where: { id },
      raw: true,
    });

    if (!record) {
      return { errCode: 1, errMessage: "Không tìm thấy yêu cầu", data: null };
    }

    await db.BookingCancellation.update(
      {
        bookingCode: payload.bookingCode ?? record.bookingCode,
        title: payload.title ?? record.title,
        reason: payload.reason ?? record.reason,
        refundMethod: payload.refundMethod ?? record.refundMethod,
        bankName: payload.bankName ?? record.bankName,
        bankNumber: payload.bankNumber ?? record.bankNumber,
        status: payload.status ?? record.status,
        adminNote: payload.adminNote ?? record.adminNote,
      },
      { where: { id } }
    );

    const updated = await db.BookingCancellation.findOne({
      where: { id },
      raw: true,
    });
    const user = await db.User.findOne({
      where: { id: updated.userId },
      attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
      raw: true,
    });

    return {
      errCode: 0,
      errMessage: "Cập nhật thành công",
      data: { ...updated, user },
    };
  } catch (e) {
    console.log("Update error:", e);
    return { errCode: -1, errMessage: "Lỗi server", data: null };
  }
};

// Xóa bản ghi hoàn hủy
let deleteCancellation = async (id) => {
  try {
    const record = await db.BookingCancellation.findOne({ where: { id } });

    if (!record)
      return { errCode: 1, errMessage: "Không tìm thấy yêu cầu", data: null };

    await db.BookingCancellation.destroy({ where: { id } });

    return { errCode: 0, errMessage: "Xóa yêu cầu thành công", data: null };
  } catch (e) {
    console.log("Delete error:", e);
    return { errCode: -1, errMessage: "Lỗi server", data: null };
  }
};

export default {
  createCancellation,
  getAllCancellations,
  getCancellationById,
  updateCancellation,
  deleteCancellation,
};
