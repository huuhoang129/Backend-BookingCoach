// src/controllers/bookingManageController/bookingCustomerController.js
import bookingCustomerService from "../../services/bookingManageServices/bookingCustomerService.js";

// Lấy danh sách khách theo booking ID
const getCustomersByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingCustomerService.getCustomersByBooking(
      bookingId
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách khách theo booking:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Thêm khách vào booking
const addCustomer = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingCustomerService.addCustomer(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi thêm khách vào booking:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật thông tin khách
const updateCustomer = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingCustomerService.updateCustomer(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật thông tin khách:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa khách khỏi booking
const deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingCustomerService.deleteCustomer(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa khách khỏi booking:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getCustomersByBooking,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
