import bannerServices from "../../services/systemManageServices/bannerServices.js";

let getAllBanners = async (req, res) => {
  try {
    let banners = await bannerServices.getAllBanners();
    return res.status(200).json(banners);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getBannerById = async (req, res) => {
  try {
    let infor = await bannerServices.getBannerById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createBanner = async (req, res) => {
  try {
    let infor = await bannerServices.createBanner(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let editBanner = async (req, res) => {
  let data = req.body;
  let message = await bannerServices.updateBanner(data);
  return res.status(200).json(message);
};

let deleteBanner = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await bannerServices.deleteBanner(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  editBanner,
  deleteBanner,
};
