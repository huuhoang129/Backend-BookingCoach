import bookingService from "../../services/bookingManageServices/bookingService";
import { generateInvoice } from "../../services/paymentManageService/invoiceService.js";
import db from "../../models/index.js";

let getAllBookings = async (req, res) => {
  try {
    let result = await bookingService.getAllBookings();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getAllBookings error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getBookingById = async (req, res) => {
  try {
    let bookingId = req.params.id;
    let result = await bookingService.getBookingById(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getBookingById error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let createBooking = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingService.createBooking(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createBooking error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateBookingStatus = async (req, res) => {
  try {
    let { bookingId, status } = req.body;
    let result = await bookingService.updateBookingStatus(bookingId, status);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateBookingStatus error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let deleteBooking = async (req, res) => {
  try {
    let bookingId = req.params.id;
    let result = await bookingService.deleteBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteBooking error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

export default {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
