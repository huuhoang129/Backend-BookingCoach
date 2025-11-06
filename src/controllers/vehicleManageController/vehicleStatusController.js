import vehicleStatusService from "../../services/vehicleManageServices/vehicleStatusServices";

/* ==========================
   Lấy tất cả tình trạng xe
========================== */
let getAllVehicleStatus = async (req, res) => {
  try {
    const result = await vehicleStatusService.getAllVehicleStatus();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
      error: e.message,
    });
  }
};

/* ==========================
   Lấy tình trạng theo vehicleId
========================== */
let getStatusByVehicleId = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleStatusService.getStatusByVehicleId(vehicleId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
      error: e.message,
    });
  }
};

/* ==========================
   Cập nhật / tạo mới tình trạng xe
========================== */
let updateVehicleStatus = async (req, res) => {
  try {
    const result = await vehicleStatusService.updateVehicleStatus(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
      error: e.message,
    });
  }
};

/* ==========================
   Xóa tình trạng xe
========================== */
let deleteVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await vehicleStatusService.deleteVehicleStatus(id);
    return res.json(result);
  } catch (e) {
    console.error("❌ deleteVehicleStatus error:", e);
    return res.status(500).json({
      errCode: 99,
      errMessage: "Server error",
    });
  }
};

export default {
  getAllVehicleStatus,
  getStatusByVehicleId,
  updateVehicleStatus,
  deleteVehicleStatus,
};
