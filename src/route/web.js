import express from "express";

import bannerController from "../controllers/systemManageController/bannerController.js";
import authController from "../controllers/userManageController/authController.js";
import userController from "../controllers/userManageController/userController.js";
import employeeController from "../controllers/userManageController/employeeController.js";
import accountController from "../controllers/userManageController/accountController.js";

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

  router.get("/api/v1/get-all-user", userController.getAllUsers);
  router.get("/api/v1/get-user-by-id", userController.getUserById);
  router.put("/api/v1/edit-user", userController.editUser);
  router.delete("/api/v1/delete-user", userController.deleteUser);

  router.get("/api/v1/get-all-employee", employeeController.getAllEmployees);
  router.get("/api/v1/get-employee-by-id", employeeController.getEmployeeById);
  router.post("/api/v1/create-employee", employeeController.createEmployee);
  router.put("/api/v1/edit-employee", employeeController.updateEmployee);
  router.delete("/api/v1/delete-employee", employeeController.deleteEmployee);

  router.get("/api/v1/get-all-accounts", accountController.getAllAccounts);
  router.put("/api/v1/lock-account", accountController.lockAccount);
  router.put("/api/v1/unlock-account", accountController.unlockAccount);
  return app.use("/", router);
};

module.exports = initWebRoutes;
