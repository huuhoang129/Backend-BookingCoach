// src/services/stationManageServices/locationService.js
import db from "../../models/index.js";

// Lấy toàn bộ tỉnh/thành
let getAllProvinces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let provinces = await db.Province.findAll({
        order: [["nameProvince", "ASC"]],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách tỉnh thành công",
        data: provinces,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tỉnh theo ID (kèm danh sách địa điểm thuộc tỉnh)
let getProvinceById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số đầu vào",
        });
      } else {
        let province = await db.Province.findOne({
          where: { id: inputId },
          include: [{ model: db.Location, as: "locations" }],
          raw: false,
        });

        resolve({
          errCode: 0,
          errMessage: "Lấy thông tin tỉnh thành công",
          data: province,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới tỉnh
let createProvince = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameProvince) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tên tỉnh",
        });
      }

      // Tự sinh mã tỉnh từ chữ cái đầu
      const code = data.nameProvince
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("");

      await db.Province.create({
        nameProvince: data.nameProvince,
        valueProvince: code,
      });

      resolve({
        errCode: 0,
        errMessage: "Tạo tỉnh thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin tỉnh
let updateProvince = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !data.nameProvince) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số đầu vào",
        });
      }

      let province = await db.Province.findOne({ where: { id } });
      if (!province) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy tỉnh",
        });
      }

      // Sinh lại mã tỉnh từ tên
      const code = data.nameProvince
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("");

      await db.Province.update(
        {
          nameProvince: data.nameProvince,
          valueProvince: code,
        },
        { where: { id } }
      );

      resolve({
        errCode: 0,
        errMessage: "Cập nhật tỉnh thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa tỉnh theo ID
let deleteProvince = (provinceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let province = await db.Province.findOne({ where: { id: provinceId } });
      if (!province) {
        resolve({
          errCode: 2,
          errMessage: "Tỉnh không tồn tại",
        });
      } else {
        await db.Province.destroy({ where: { id: provinceId } });
        resolve({
          errCode: 0,
          errMessage: "Xóa tỉnh thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy toàn bộ địa điểm (kèm thông tin tỉnh)
let getAllLocations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let locations = await db.Location.findAll({
        include: [{ model: db.Province, as: "province" }],
        order: [["id", "ASC"]],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách địa điểm thành công",
        data: locations,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy địa điểm theo ID
let getLocationById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số đầu vào",
        });
      } else {
        let location = await db.Location.findOne({
          where: { id: inputId },
          include: [{ model: db.Province, as: "province" }],
          raw: false,
        });

        resolve({
          errCode: 0,
          errMessage: "Lấy thông tin địa điểm thành công",
          data: location,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới địa điểm
let createLocation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameLocations || !data.provinceId) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số đầu vào",
        });
      } else {
        await db.Location.create({
          nameLocations: data.nameLocations,
          type: data.type || "station",
          provinceId: data.provinceId,
        });

        resolve({
          errCode: 0,
          errMessage: "Tạo địa điểm thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật địa điểm
let updateLocation = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !data.nameLocations || !data.provinceId) {
        return resolve({ errCode: 1, errMessage: "Thiếu tham số đầu vào" });
      }

      let location = await db.Location.findOne({ where: { id }, raw: false });
      if (!location) {
        return resolve({ errCode: 2, errMessage: "Không tìm thấy địa điểm" });
      }

      await db.Location.update(
        {
          nameLocations: data.nameLocations,
          type: data.type || "station",
          provinceId: data.provinceId,
        },
        { where: { id } }
      );

      resolve({
        errCode: 0,
        errMessage: "Cập nhật địa điểm thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa địa điểm
let deleteLocation = (locationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let location = await db.Location.findOne({ where: { id: locationId } });
      if (!location) {
        resolve({
          errCode: 2,
          errMessage: "Địa điểm không tồn tại",
        });
      } else {
        await db.Location.destroy({ where: { id: locationId } });
        resolve({
          errCode: 0,
          errMessage: "Xóa địa điểm thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy danh sách tỉnh + địa điểm dạng cây (Tree Select)
let getAllProvincesWithLocationsTree = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let provinces = await db.Province.findAll({
        include: [{ model: db.Location, as: "locations" }],
        order: [["nameProvince", "ASC"]],
        raw: false,
      });

      // Chuẩn hóa lại cấu trúc dữ liệu cho UI
      let data = provinces.map((province) => ({
        value: province.valueProvince,
        label: province.nameProvince,
        children: province.locations.map((loc) => ({
          value: loc.id.toString(),
          label: loc.nameLocations,
        })),
      }));

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách cây tỉnh thành công",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
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
  getAllProvincesWithLocationsTree,
};
