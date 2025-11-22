// src/controllers/tripManageController/tripPriceController.js
import tripPriceService from "../../services/tripManageServices/tripPriceServices";

// Lấy tất cả bảng giá
let getAllTripPrices = async (req, res) => {
  try {
    const result = await tripPriceService.getAllTripPrices();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy danh sách bảng giá:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Lấy bảng giá theo ID
let getTripPriceById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await tripPriceService.getTripPriceById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy bảng giá theo ID:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Tạo bảng giá mới
let createTripPrice = async (req, res) => {
  try {
    const result = await tripPriceService.createTripPrice(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tạo bảng giá:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Cập nhật bảng giá
let updateTripPrice = async (req, res) => {
  try {
    const result = await tripPriceService.updateTripPrice({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi cập nhật bảng giá:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Xóa bảng giá
let deleteTripPrice = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await tripPriceService.deleteTripPrice(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi xóa bảng giá:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

export default {
  getAllTripPrices,
  getTripPriceById,
  createTripPrice,
  updateTripPrice,
  deleteTripPrice,
};
