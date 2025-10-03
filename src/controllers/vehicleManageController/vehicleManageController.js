import vehicleService from "../../services/vehicleManageServices/vehicleServices";

let getAllVehicles = async (req, res) => {
  try {
    let vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json(vehicles);
  } catch (e) {
    console.error("getAllVehicles error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getVehicleById = async (req, res) => {
  try {
    let vehicleId = req.params.id;
    let result = await vehicleService.getVehicleById(vehicleId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getVehicleById error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let createVehicle = async (req, res) => {
  try {
    let result = await vehicleService.createVehicle(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createVehicle error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let updateVehicle = async (req, res) => {
  try {
    const result = await vehicleService.updateVehicle({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error("updateVehicle error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let deleteVehicle = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  try {
    let message = await vehicleService.deleteVehicle(id);
    return res.status(200).json(message);
  } catch (e) {
    console.error("deleteVehicle error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

export default {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
