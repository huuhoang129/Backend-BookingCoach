import bannerServices from "../../services/systemManageServices/bannerServices.js";

// Lấy danh sách tất cả banner
let getAllBanners = async (req, res) => {
  try {
    const banners = await bannerServices.getAllBanners();
    return res.status(200).json(banners);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách banner:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy thông tin banner theo ID
let getBannerById = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    const result = await bannerServices.getBannerById(id);

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy banner theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới banner
let createBanner = async (req, res) => {
  try {
    const result = await bannerServices.createBanner(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo banner:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật thông tin banner
let editBanner = async (req, res) => {
  try {
    const data = req.body;
    const result = await bannerServices.updateBanner(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật banner:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa banner
let deleteBanner = async (req, res) => {
  try {
    const id = req.body.id;

    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số id",
      });
    }

    const result = await bannerServices.deleteBanner(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa banner:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  editBanner,
  deleteBanner,
};
