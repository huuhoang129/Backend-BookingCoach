import express from "express";

import bannerController from "../controllers/systemManageController/bannerController.js";
import authController from "../controllers/userManageController/authController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // Banner
  router.get("/api/v1/get-banner", bannerController.getAllBanners);
  router.get("/api/v1/get-banner-by-id", bannerController.getBannerById);
  router.post("/api/v1/create-banner", bannerController.createBanner);
  router.put("/api/v1/edit-banner", bannerController.editBanner);
  router.delete("/api/v1/delete-banner", bannerController.deleteBanner);

  router.post("/api/v1/register", authController.registerUser);
  router.post("/api/v1/login", authController.loginUser);
  router.post("/api/v1/forgot-password", authController.forgotPassword);
  router.post("/api/v1/reset-password", authController.resetPassword);
  return app.use("/", router);
};

module.exports = initWebRoutes;
