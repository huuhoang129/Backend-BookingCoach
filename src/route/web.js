import express from "express";

import bannerController from "../controllers/systemManageController/bannerController.js";
import staticPageController from "../controllers/systemManageController/staticPageController.js";
import authController from "../controllers/userManageController/authController.js";
import userController from "../controllers/userManageController/userController.js";
import employeeController from "../controllers/userManageController/employeeController.js";
import accountController from "../controllers/userManageController/accountController.js";
import newsController from "../controllers/systemManageController/newController";
import locationsController from "../controllers/stationManageController/locationController";
import routesController from "../controllers/stationManageController/routeController.js";
import coachTripController from "../controllers/stationManageController/coachTripController.js";
import bookingController from "../controllers/bookingManageController/bookingController";
import bookingCustomerController from "../controllers/bookingManageController/bookingCustomerController.js";
import bookingPointController from "../controllers/bookingManageController/bookingPointController.js";
import bookingSeatController from "../controllers/bookingManageController/bookingSeatController.js";
import bookingPaymentController from "../controllers/bookingManageController/bookingPaymentController.js";
import paymentController from "../controllers/paymentManageController/paymentController";
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

  // staticPage
  router.get(
    "/api/v1/static-page/:pageKey",
    staticPageController.getStaticPage
  );
  router.put(
    "/api/v1/static-page/:pageKey",
    staticPageController.updateStaticPage
  );

  // Locations
  router.get("/api/v1/provinces", locationsController.getAllProvinces);
  router.get("/api/v1/provinces/:id", locationsController.getProvinceById);
  router.post("/api/v1/provinces", locationsController.createProvince);
  router.delete("/api/v1/provinces/:id", locationsController.deleteProvince);
  router.get("/api/v1/locations", locationsController.getAllLocations);
  router.get("/api/v1/locations/:id", locationsController.getLocationById);
  router.post("/api/v1/locations", locationsController.createLocation);
  router.delete("/api/v1/locations/:id", locationsController.deleteLocation);
  router.get("/api/v1/locations-tree", locationsController.getAllLocationsTree);

  // coachRoute
  router.get("/api/v1/routes", routesController.getAllRoutes);
  router.get("/api/v1/routes/:id", routesController.getRouteById);
  router.post("/api/v1/routes", routesController.createRoute);
  router.put("/api/v1/routes/:id", routesController.updateRoute);
  router.delete("/api/v1/routes/:id", routesController.deleteRoute);

  // coachTrip
  router.get("/api/v1/trips", coachTripController.getAllTrips);
  router.get("/api/v1/trips/:id", coachTripController.getTripById);
  router.post("/api/v1/trips", coachTripController.createTrip);
  router.put("/api/v1/trips/:id", coachTripController.updateTrip);
  router.delete("/api/v1/trips/:id", coachTripController.deleteTrip);
  router.get("/api/v1/search-trips", coachTripController.searchTrips);

  //booking
  router.get("/api/v1/bookings", bookingController.getAllBookings);
  router.get("/api/v1/bookings/:id", bookingController.getBookingById);
  router.post("/api/v1/bookings", bookingController.createBooking);
  router.put("/api/v1/bookings", bookingController.updateBookingStatus);
  router.delete("/api/v1/bookings/:id", bookingController.deleteBooking);

  //bookingCustomer
  router.get(
    "/api/v1/bookings/:bookingId/customers",
    bookingCustomerController.getCustomersByBooking
  );
  router.post(
    "/api/v1/bookings/customers",
    bookingCustomerController.addCustomer
  );
  router.put(
    "/api/v1/bookings/customers",
    bookingCustomerController.updateCustomer
  );
  router.delete(
    "/api/v1/bookings/customers/:id",
    bookingCustomerController.deleteCustomer
  );

  //bookingPoint
  router.get(
    "/api/v1/bookings/:bookingId/points",
    bookingPointController.getPointsByBooking
  );
  router.post("/api/v1/bookings/points", bookingPointController.addPoint);
  router.put("/api/v1/bookings/points", bookingPointController.updatePoint);
  router.delete(
    "/api/v1/bookings/points/:id",
    bookingPointController.deletePoint
  );

  //bookingSeat
  router.get(
    "/api/v1/bookings/:bookingId/seats",
    bookingSeatController.getSeatsByBooking
  );
  router.post("/api/v1/bookings/seats", bookingSeatController.addSeat);
  router.put("/api/v1/bookings/seats", bookingSeatController.updateSeat);
  router.delete("/api/v1/bookings/seats/:id", bookingSeatController.deleteSeat);

  //payment
  router.post(
    "/api/v1/bookings/payments",
    bookingPaymentController.createPayment
  );
  router.get(
    "/api/v1/bookings/payments/:bookingId",
    bookingPaymentController.getPaymentByBooking
  );
  router.put(
    "/api/v1/bookings/payments/status",
    bookingPaymentController.updatePaymentStatus
  );

  router.post(
    "/api/v1/payments/create-banking-qr",
    paymentController.createBankingQR
  );

  // News
  router.get("/api/v1/news", newsController.getAllNews);
  router.get("/api/v1/news/:id", newsController.getNewsById);
  router.post("/api/v1/news", newsController.createNews);
  router.put("/api/v1/news", newsController.updateNews);
  router.delete("/api/v1/news/:id", newsController.deleteNews);

  // Auth
  router.post("/api/v1/register", authController.registerUser);
  router.post("/api/v1/login", authController.loginUser);
  router.post("/api/v1/forgot-password", authController.forgotPassword);
  router.post("/api/v1/reset-password", authController.resetPassword);

  // userManage
  router.get("/api/v1/get-all-user", userController.getAllUsers);
  router.get("/api/v1/get-user-by-id", userController.getUserById);
  router.post("/api/v1/create-user", userController.createUser);
  router.put("/api/v1/edit-user", userController.editUser);
  router.delete("/api/v1/delete-user", userController.deleteUser);

  // employeeManage
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
