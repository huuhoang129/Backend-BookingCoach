import provinceLocationServices from "../../services/stationManageServices/locationService";

// ==================== PROVINCES ====================
let getAllProvinces = async (req, res) => {
  try {
    let provinces = await provinceLocationServices.getAllProvinces();
    return res.status(200).json(provinces);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getProvinceById = async (req, res) => {
  try {
    let infor = await provinceLocationServices.getProvinceById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createProvince = async (req, res) => {
  try {
    let infor = await provinceLocationServices.createProvince(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteProvince = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await provinceLocationServices.deleteProvince(id);
  return res.status(200).json(message);
};

// ==================== LOCATIONS ====================
let getAllLocations = async (req, res) => {
  try {
    let locations = await provinceLocationServices.getAllLocations();
    return res.status(200).json(locations);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getLocationById = async (req, res) => {
  try {
    let infor = await provinceLocationServices.getLocationById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createLocation = async (req, res) => {
  try {
    let infor = await provinceLocationServices.createLocation(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteLocation = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await provinceLocationServices.deleteLocation(id);
  return res.status(200).json(message);
};

module.exports = {
  getAllProvinces,
  getProvinceById,
  createProvince,
  deleteProvince,
  getAllLocations,
  getLocationById,
  createLocation,
  deleteLocation,
};
