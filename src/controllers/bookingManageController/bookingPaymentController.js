import paymentService from "../../services/bookingManageServices/bookingPaymentService.js";

let getAllPayments = async (req, res) => {
  try {
    let result = await paymentService.getAllPayments();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getAllPayments error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let createPayment = async (req, res) => {
  try {
    let result = await paymentService.createPayment(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createPayment error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let getPaymentByBooking = async (req, res) => {
  try {
    let bookingId = req.params.bookingId;
    let result = await paymentService.getPaymentByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getPaymentByBooking error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let updatePaymentStatus = async (req, res) => {
  try {
    let result = await paymentService.updatePaymentStatus(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updatePaymentStatus error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

export default {
  getAllPayments,
  createPayment,
  getPaymentByBooking,
  updatePaymentStatus,
};
