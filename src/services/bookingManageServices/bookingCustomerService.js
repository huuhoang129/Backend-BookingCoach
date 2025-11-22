// src/services/bookingManageServices/bookingCustomerService.js
import db from "../../models/index.js";

// Lấy danh sách khách theo bookingId
let getCustomersByBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số: bookingId",
        });
      }

      // Lấy danh sách khách của booking
      let customers = await db.BookingCustomers.findAll({
        where: { bookingId },
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách thành công",
        data: customers,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Thêm khách vào booking
let addCustomer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.fullName || !data.phone) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Tạo bản ghi khách hàng
      let customer = await db.BookingCustomers.create({
        bookingId: data.bookingId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
      });

      resolve({
        errCode: 0,
        errMessage: "Thêm khách thành công",
        data: customer,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin khách
let updateCustomer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.fullName || !data.phone) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Cập nhật khách theo id
      const [updated] = await db.BookingCustomers.update(
        {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy khách hàng",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Cập nhật khách hàng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa khách theo id
let deleteCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra khách tồn tại không
      let customer = await db.BookingCustomers.findOne({ where: { id } });
      if (!customer) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy khách hàng để xóa",
        });
      }

      // Xóa khách
      await db.BookingCustomers.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Xóa khách hàng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getCustomersByBooking,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
