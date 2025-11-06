import driverServices from "../../services/userManageServices/driverServices.js";

let getAllDrivers = async (req, res) => {
  try {
    let drivers = await driverServices.getAllDrivers();
    return res.status(200).json(drivers);
  } catch (e) {
    console.log("Get All Drivers Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDriverById = async (req, res) => {
  try {
    let driver = await driverServices.getDriverById(req.params.id);
    return res.status(200).json(driver);
  } catch (e) {
    console.log("Get Driver By ID Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createDriver = async (req, res) => {
  try {
    let message = await driverServices.createDriver(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Create Driver Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let updateDriver = async (req, res) => {
  try {
    let data = { ...req.body, id: req.params.id };
    let message = await driverServices.updateDriver(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Update Driver Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteDriver = async (req, res) => {
  try {
    let message = await driverServices.deleteDriver(req.params.id);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Delete Driver Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

export default {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
