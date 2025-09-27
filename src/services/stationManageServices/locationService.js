import db from "../../models/index.js";

// ==================== PROVINCES ====================

let getAllProvinces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let provinces = await db.Province.findAll({
        include: [{ model: db.Location, as: "locations" }],
        order: [["nameProvince", "ASC"]],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: provinces,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getProvinceById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let province = await db.Province.findOne({
          where: { id: inputId },
          include: [{ model: db.Location, as: "locations" }],
          raw: false,
        });

        resolve({
          errCode: 0,
          errMessage: "OK",
          data: province,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createProvince = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameProvince) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Province.create({
          nameProvince: data.nameProvince,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteProvince = (provinceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let province = await db.Province.findOne({ where: { id: provinceId } });
      if (!province) {
        resolve({
          errCode: 2,
          errMessage: "Province isn't exist",
        });
      } else {
        await db.Province.destroy({ where: { id: provinceId } });
        resolve({
          errCode: 0,
          errMessage: "Province deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// ==================== LOCATIONS ====================

let getAllLocations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let locations = await db.Location.findAll({
        include: [{ model: db.Province, as: "province" }],
        order: [["id", "ASC"]],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: locations,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getLocationById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let location = await db.Location.findOne({
          where: { id: inputId },
          include: [{ model: db.Province, as: "province" }],
          raw: false,
        });

        resolve({
          errCode: 0,
          errMessage: "OK",
          data: location,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createLocation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameLocations || !data.provinceId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Location.create({
          nameLocations: data.nameLocations,
          type: data.type || "station",
          provinceId: data.provinceId,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteLocation = (locationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let location = await db.Location.findOne({ where: { id: locationId } });
      if (!location) {
        resolve({
          errCode: 2,
          errMessage: "Location isn't exist",
        });
      } else {
        await db.Location.destroy({ where: { id: locationId } });
        resolve({
          errCode: 0,
          errMessage: "Location deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
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
