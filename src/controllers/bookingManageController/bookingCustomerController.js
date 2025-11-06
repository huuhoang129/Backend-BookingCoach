import bookingCustomerService from "../../services/bookingManageServices/bookingCustomerService.js";

/**
 * Lấy danh sách khách hàng
 */
const getCustomersByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingCustomerService.getCustomersByBooking(
      bookingId
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error(
      "BookingCustomerController - getCustomersByBooking error:",
      e
    );
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Thêm khách hàng vào booking
 */
const addCustomer = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingCustomerService.addCustomer(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingCustomerController - addCustomer error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Cập nhật thông tin khách hàng
 */
const updateCustomer = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingCustomerService.updateCustomer(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingCustomerController - updateCustomer error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Xóa khách hàng
 */
const deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingCustomerService.deleteCustomer(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingCustomerController - deleteCustomer error:", e);
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
