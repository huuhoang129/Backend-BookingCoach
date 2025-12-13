//src/controllers/bookingManageController/bookingCancellationController.js
import bookingCancellationService from "../../services/bookingManageServices/bookingCancellationService";

// Tạo mới hoàn hủy
const createCancellation = async (req, res) => {
  const response = await bookingCancellationService.createCancellation(
    req.body
  );
  return res.status(200).json(response);
};

// Lấy danh sách hoàn hủy
const getAllCancellations = async (req, res) => {
  const response = await bookingCancellationService.getAllCancellations();
  return res.status(200).json(response);
};

// Lấy bản ghi hoàn hủy theo id
const getCancellationById = async (req, res) => {
  const { id } = req.params;
  const response = await bookingCancellationService.getCancellationById(id);
  return res.status(200).json(response);
};

// Cập nhật bản ghi hoàn hủy
const updateCancellation = async (req, res) => {
  const { id } = req.params;
  const response = await bookingCancellationService.updateCancellation(
    id,
    req.body
  );
  return res.status(200).json(response);
};

// Xóa bản ghi hoàn hủy
const deleteCancellation = async (req, res) => {
  const { id } = req.params;
  const response = await bookingCancellationService.deleteCancellation(id);
  return res.status(200).json(response);
};

export default {
  createCancellation,
  getAllCancellations,
  getCancellationById,
  updateCancellation,
  deleteCancellation,
};
