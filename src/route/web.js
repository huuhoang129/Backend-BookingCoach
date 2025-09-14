import express from "express";
// import userController from "../controllers/userController";
import bannerController from "../controllers/systemManageController/bannerController.js";
import newController from "../controllers/systemManageController/newController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // Banner
  router.get("/api/v1/get-banner", bannerController.getAllBanners);
  router.get("/api/v1/get-banner-by-id", bannerController.getBannerById);
  router.post("/api/v1/create-banner", bannerController.createBanner);
  router.put("/api/v1/edit-banner", bannerController.editBanner);
  router.delete("/api/v1/delete-banner", bannerController.deleteBanner);

  router.post("/api/v1/create-new", newController.createNews);
  router.get("/api/v1/get-all-news", newController.getAllNews);
  router.get("/api/v1/get-news-by-id", newController.getNewsById);
  router.delete("/api/v1/delete-news", newController.deleteNews);
  router.put("/api/v1/edit-news", newController.editNews);
  return app.use("/", router);
};

module.exports = initWebRoutes;
