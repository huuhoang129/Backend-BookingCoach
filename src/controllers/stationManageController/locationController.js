// src/controllers/stationManageController/locationController.js
import provinceLocationServices from "../../services/stationManageServices/locationService";

// ==================== PROVINCES ====================

/// Lấy danh sách tỉnh
let getAllProvinces = async (req, res) => {
  try {
    const provinces = await provinceLocationServices.getAllProvinces();
    return res.status(200).json(provinces);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách tỉnh:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy thông tin tỉnh theo ID
let getProvinceById = async (req, res) => {
  try {
    const result = await provinceLocationServices.getProvinceById(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy tỉnh theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới tỉnh
let createProvince = async (req, res) => {
  try {
    const result = await provinceLocationServices.createProvince(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo tỉnh:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật tỉnh
let updateProvince = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await provinceLocationServices.updateProvince(id, req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật tỉnh:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa tỉnh
let deleteProvince = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số id",
      });
    }

    const result = await provinceLocationServices.deleteProvince(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa tỉnh:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// ==================== LOCATIONS ====================

/// Lấy danh sách địa điểm
let getAllLocations = async (req, res) => {
  try {
    const locations = await provinceLocationServices.getAllLocations();
    return res.status(200).json(locations);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách địa điểm:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/// Lấy thông tin địa điểm theo ID
let getLocationById = async (req, res) => {
  try {
    const result = await provinceLocationServices.getLocationById(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy địa điểm theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới địa điểm
let createLocation = async (req, res) => {
  try {
    const result = await provinceLocationServices.createLocation(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo địa điểm:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật địa điểm
let updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await provinceLocationServices.updateLocation(id, req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật địa điểm:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa địa điểm
let deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số id",
      });
    }

    const result = await provinceLocationServices.deleteLocation(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa địa điểm:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy danh sách tỉnh + địa điểm dạng cây
let getAllLocationsTree = async (req, res) => {
  try {
    const data =
      await provinceLocationServices.getAllProvincesWithLocationsTree();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách tỉnh + địa điểm dạng cây:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

module.exports = {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocationsTree,
};
