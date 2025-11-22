// src/controllers/vehicleManageController/vehicleStatusController.js
import vehicleStatusService from "../../services/vehicleManageServices/vehicleStatusServices.js";

// Lấy tất cả tình trạng xe
let getAllVehicleStatus = async (req, res) => {
  try {
    const result = await vehicleStatusService.getAllVehicleStatus();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy danh sách tình trạng xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy tình trạng xe theo vehicleId
let getStatusByVehicleId = async (req, res) => {
  try {
    const result = await vehicleStatusService.getStatusByVehicleId(
      req.params.vehicleId
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy tình trạng xe theo vehicleId:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật tình trạng xe
let updateVehicleStatus = async (req, res) => {
  try {
    const result = await vehicleStatusService.updateVehicleStatus(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi cập nhật tình trạng xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa tình trạng xe
let deleteVehicleStatus = async (req, res) => {
  try {
    const result = await vehicleStatusService.deleteVehicleStatus(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi xóa tình trạng xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllVehicleStatus,
  getStatusByVehicleId,
  updateVehicleStatus,
  deleteVehicleStatus,
};
