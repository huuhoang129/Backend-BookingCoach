import express from "express";

import bannerController from "../controllers/systemManageController/bannerController.js";
import staticPageController from "../controllers/systemManageController/staticPageController.js";
import authController from "../controllers/userManageController/authController.js";
import userController from "../controllers/userManageController/userController.js";
import employeeController from "../controllers/userManageController/employeeController.js";
import accountController from "../controllers/userManageController/accountController.js";
import { uploadFile } from "../controllers/uploadController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/v1/upload/:folder", uploadFile);
  // Banner
  router.get("/api/v1/get-banner", bannerController.getAllBanners);
  router.get("/api/v1/get-banner-by-id", bannerController.getBannerById);
  router.post("/api/v1/create-banner", bannerController.createBanner);
  router.put("/api/v1/edit-banner", bannerController.editBanner);
  router.delete("/api/v1/delete-banner", bannerController.deleteBanner);

  // Static Page
  // About
  router.get("/api/v1/get-about-page", staticPageController.getAboutPage);
  // router.post(
  //   "/api/v1/create-about-page",
  //   staticPageController.createAboutPage
  // );
  router.put("/api/v1/update-about-page", staticPageController.updateAboutPage);

  // Conditions
  router.get(
    "/api/v1/get-conditions-page",
    staticPageController.getConditionsPage
  );
  router.put(
    "/api/v1/update-conditions-page",
    staticPageController.updateConditionsPage
  );

  // PrivacyPolicy
  router.get(
    "/api/v1/get-privacy-policy-page",
    staticPageController.getPrivacyPolicyPage
  );
  router.put(
    "/api/v1/update-privacy-policy-page",
    staticPageController.updatePrivacyPolicyPage
  );

  // RefundPolicy
  router.get(
    "/api/v1/get-refund-policy-page",
    staticPageController.getRefundPolicyPage
  );
  router.put(
    "/api/v1/update-refund-policy-page",
    staticPageController.updateRefundPolicyPage
  );

  // PaymentPolicy
  router.get(
    "/api/v1/get-payment-policy-page",
    staticPageController.getPaymentPolicyPage
  );
  router.put(
    "/api/v1/update-payment-policy-page",
    staticPageController.updatePaymentPolicyPage
  );

  // CancellationPolicy
  router.get(
    "/api/v1/get-cancellation-policy-page",
    staticPageController.getCancellationPolicyPage
  );
  router.put(
    "/api/v1/update-cancellation-policy-page",
    staticPageController.updateCancellationPolicyPage
  );

  // Conditions
  router.get(
    "/api/v1/get-shipping-policy-page",
    staticPageController.getShippingPolicyPage
  );
  router.put(
    "/api/v1/update-shipping-policy-page",
    staticPageController.updateShippingPolicyPage
  );

  router.post("/api/v1/register", authController.registerUser);
  router.post("/api/v1/login", authController.loginUser);
  router.post("/api/v1/forgot-password", authController.forgotPassword);
  router.post("/api/v1/reset-password", authController.resetPassword);

  router.get("/api/v1/get-all-user", userController.getAllUsers);
  router.get("/api/v1/get-user-by-id", userController.getUserById);
  router.post("/api/v1/create-user", userController.createUser);
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
