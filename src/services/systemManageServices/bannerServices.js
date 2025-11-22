// src/services/systemManageServices/bannerServices.js
import db from "../../models/index.js";

// Lấy toàn bộ danh sách banner
let getAllBanners = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let banners = await db.Banners.findAll();

      // Chuyển dữ liệu ảnh từ base64 sang binary để hiển thị
      if (banners && banners.length > 0) {
        banners.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách banner thành công",
        data: banners,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy thông tin banner theo ID
let getBannerById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc: id",
        });
      }

      const data = await db.Banners.findOne({
        where: {
          id: inputId,
        },
        attributes: ["title", "image"],
        raw: true,
      });

      // Chuyển dữ liệu ảnh sang dạng binary
      if (data && data.image) {
        data.image = Buffer.from(data.image).toString("binary");
      }

      resolve({
        errMessage: "Lấy thông tin banner thành công",
        errCode: 0,
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới banner
let createBanner = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra tham số đầu vào
      if (!data.title || !data.imageBase64) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Tạo banner mới
      await db.Banners.create({
        title: data.title,
        image: data.imageBase64,
      });

      resolve({
        errCode: 0,
        errMessage: "Tạo banner thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa banner theo ID
let deleteBanner = (bannerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra banner có tồn tại không
      const foundBanner = await db.Banners.findOne({
        where: { id: bannerId },
      });

      if (!foundBanner) {
        return resolve({
          errCode: 2,
          errMessage: "Banner không tồn tại",
        });
      }

      await db.Banners.destroy({
        where: { id: bannerId },
      });

      resolve({
        errCode: 0,
        errMessage: "Xóa banner thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin banner
let updateBanner = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra tham số bắt buộc
      if (!data.id || !data.title) {
        return resolve({
          errCode: 2,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      // Tìm banner cần cập nhật
      const banner = await db.Banners.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (banner) {
        banner.title = data.title;
        if (data.imageBase64) {
          banner.image = data.imageBase64;
        }
        await banner.save();
        resolve({
          errCode: 0,
          errMessage: "Cập nhật banner thành công",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Không tìm thấy banner",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  deleteBanner,
  updateBanner,
};
