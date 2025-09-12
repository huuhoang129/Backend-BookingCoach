import express from "express";
// import userController from "../controllers/userController";
import bannerController from "../controllers/systemManageController/bannerController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // user
  // router.post("/api/v1/register", userController.handleRegister);
  // router.post("/api/v1/login", userController.handleLogin);

  router.get("/api/v1/get-banner", bannerController.getAllBanners);
  router.get("/api/v1/get-banner-by-id", bannerController.getBannerById);
  router.post("/api/v1/create-banner", bannerController.createBanner);
  router.put("/api/v1/edit-banner", bannerController.editBanner);
  router.delete("/api/v1/delete-banner", bannerController.deleteBanner);

  return app.use("/", router);
};

module.exports = initWebRoutes;
