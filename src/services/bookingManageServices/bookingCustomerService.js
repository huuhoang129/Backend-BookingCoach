import db from "../../models/index.js";

// Lấy danh sách khách theo bookingId
let getCustomersByBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: bookingId",
        });
      }

      let customers = await db.BookingCustomers.findAll({
        where: { bookingId },
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: customers,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Thêm khách cho 1 booking
let addCustomer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.fullName || !data.phone) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      let customer = await db.BookingCustomers.create({
        bookingId: data.bookingId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
      });

      resolve({
        errCode: 0,
        errMessage: "Customer added successfully",
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
          errMessage: "Missing required parameters",
        });
      }

      const [updated] = await db.BookingCustomers.update(
        {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({ errCode: 2, errMessage: "Customer not found" });
      }

      resolve({
        errCode: 0,
        errMessage: "Customer updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa khách
let deleteCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer = await db.BookingCustomers.findOne({ where: { id } });
      if (!customer) {
        return resolve({
          errCode: 2,
          errMessage: "Customer not found",
        });
      }

      await db.BookingCustomers.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Customer deleted successfully",
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
