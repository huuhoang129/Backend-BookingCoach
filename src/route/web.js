/* prettier-ignore-file */
import express from "express";
/* ======================= SYSTEM MANAGE ======================= */
import bannerController from "../controllers/systemManageController/bannerController.js";
import staticPageController from "../controllers/systemManageController/staticPageController.js";
import newsController from "../controllers/systemManageController/newController.js";

/* ======================= USER MANAGE ======================= */
import authController from "../controllers/userManageController/authController.js";
import userController from "../controllers/userManageController/userController.js";
import driverController from "../controllers/userManageController/driverController.js";
import accountController from "../controllers/userManageController/accountController.js";

/* ======================= STATION MANAGE ======================= */
import locationsController from "../controllers/stationManageController/locationController.js";
import routesController from "../controllers/stationManageController/routeController.js";
import coachTripController from "../controllers/stationManageController/coachTripController.js";

/* ======================= TRIP MANAGE ======================= */
import scheduleController from "../controllers/tripManageController/scheduleController.js";
import tripPriceController from "../controllers/tripManageController/tripPriceController.js";

/* ======================= VEHICLE MANAGE ======================= */
import vehicleController from "../controllers/vehicleManageController/vehicleManageController.js";
import vehicleStatusController from "../controllers/vehicleManageController/vehicleStatusController.js";
import driverScheduleController from "../controllers/vehicleManageController/driverScheduleController.js";

/* ======================= BOOKING MANAGE ======================= */
import bookingController from "../controllers/bookingManageController/bookingController.js";
import bookingCustomerController from "../controllers/bookingManageController/bookingCustomerController.js";
import bookingPointController from "../controllers/bookingManageController/bookingPointController.js";
import bookingSeatController from "../controllers/bookingManageController/bookingSeatController.js";
import bookingPaymentController from "../controllers/bookingManageController/bookingPaymentController.js";
import BookingNotification from "../controllers/bookingManageController/bookingNotificationController.js";

/* ======================= PAYMENT MANAGE ======================= */
import paymentController from "../controllers/paymentManageController/paymentController.js";
import invoiceController from "../controllers/paymentManageController/invoiceController.js";
import {
  vnpayCreatePayment,
  vnpayReturn,
  vnpayIPN,
} from "../controllers/paymentManageController/vnpayController.js";
import {
  createMoMoPaymentController,
  handleMoMoIPNController,
} from "../controllers/paymentManageController/momoController.js";

/* ======================= REPORT / DASHBOARD ======================= */
import reportController from "../controllers/reportManageController/reportController.js";
import dashboardController from "../controllers/dashboardController.js";

/* ======================= OTHER ======================= */
import { uploadFile } from "../controllers/uploadController.js";

let router = express.Router();

/* prettier-ignore-file */
let initWebRoutes = (app) => {
  /* ========== DASHBOARD ========== */
  router.get("/api/v1/overview", dashboardController.getOverview);
  router.get("/api/v1/charts", dashboardController.getCharts);
  router.get("/api/v1/top-routes", dashboardController.getTopRoutes);

  /* ========== PAYMENT GATEWAYS ========== */
  // VNPay
  router.post("/api/v1/payments/vnpay", vnpayCreatePayment);
  router.get("/api/v1/payments/vnpay_return", vnpayReturn);
  router.get("/api/v1/payments/vnpay_ipn", vnpayIPN);

  // MoMo
  router.post("/api/v1/payment/momo", createMoMoPaymentController);
  router.post("/api/v1/payment/ipn/momo", handleMoMoIPNController);

  /* ========== FILE UPLOAD ========== */
  router.post("/api/v1/upload/:folder", uploadFile);

  /* ========== SYSTEM MANAGE ========== */
  // Banner
  router.get("/api/v1/get-banner", bannerController.getAllBanners);
  router.get("/api/v1/get-banner-by-id", bannerController.getBannerById);
  router.post("/api/v1/create-banner", bannerController.createBanner);
  router.put("/api/v1/edit-banner", bannerController.editBanner);
  router.delete("/api/v1/delete-banner", bannerController.deleteBanner);

  // Static Page
  router.get(
    "/api/v1/static-page/:pageKey",
    staticPageController.getStaticPage
  );
  router.put(
    "/api/v1/static-page/:pageKey",
    staticPageController.updateStaticPage
  );

  // News
  router.get("/api/v1/news", newsController.getAllNews);
  router.get("/api/v1/news/:id", newsController.getNewsById);
  router.post("/api/v1/news", newsController.createNews);
  router.put("/api/v1/news", newsController.updateNews);
  router.delete("/api/v1/news/:id", newsController.deleteNews);

  /* ========== USER MANAGE ========== */
  // Auth
  router.post("/api/v1/register", authController.registerUser);
  router.post("/api/v1/login", authController.loginUser);
  router.post("/api/v1/forgot-password", authController.forgotPassword);
  router.post("/api/v1/reset-password", authController.resetPassword);

  // User
  router.get("/api/v1/get-all-user", userController.getAllUsers);
  router.get("/api/v1/get-user-by-id", userController.getUserById);
  router.post("/api/v1/create-user", userController.createUser);
  router.put("/api/v1/edit-user", userController.editUser);
  router.delete("/api/v1/delete-user", userController.deleteUser);

  // Driver
  router.get("/api/v1/drivers", driverController.getAllDrivers);
  router.get("/api/v1/drivers/:id", driverController.getDriverById);
  router.post("/api/v1/drivers", driverController.createDriver);
  router.put("/api/v1/drivers/:id", driverController.updateDriver);
  router.delete("/api/v1/drivers/:id", driverController.deleteDriver);

  // Account
  router.get("/api/v1/get-all-accounts", accountController.getAllAccounts);
  router.put("/api/v1/lock-account", accountController.lockAccount);
  router.put("/api/v1/unlock-account", accountController.unlockAccount);

  /* ========== STATION MANAGE ========== */
  // Province & Location
  router.get("/api/v1/provinces", locationsController.getAllProvinces);
  router.get("/api/v1/provinces/:id", locationsController.getProvinceById);
  router.post("/api/v1/provinces", locationsController.createProvince);
  router.put("/api/v1/provinces/:id", locationsController.updateProvince);
  router.delete("/api/v1/provinces/:id", locationsController.deleteProvince);

  router.get("/api/v1/locations", locationsController.getAllLocations);
  router.get("/api/v1/locations/:id", locationsController.getLocationById);
  router.post("/api/v1/locations", locationsController.createLocation);
  router.put("/api/v1/locations/:id", locationsController.updateLocation);
  router.delete("/api/v1/locations/:id", locationsController.deleteLocation);
  router.get("/api/v1/locations-tree", locationsController.getAllLocationsTree);

  // Routes
  router.get("/api/v1/routes", routesController.getAllRoutes);
  router.get("/api/v1/routes/:id", routesController.getRouteById);
  router.post("/api/v1/routes", routesController.createRoute);
  router.put("/api/v1/routes/:id", routesController.updateRoute);
  router.delete("/api/v1/routes/:id", routesController.deleteRoute);

  /* ========== TRIP MANAGE ========== */
  router.get("/api/v1/trips", coachTripController.getAllTrips);
  router.get("/api/v1/trips/:id", coachTripController.getTripById);
  router.post("/api/v1/trips", coachTripController.createTrip);
  router.put("/api/v1/trips/:id", coachTripController.updateTrip);
  router.delete("/api/v1/trips/:id", coachTripController.deleteTrip);
  router.get("/api/v1/search-trips", coachTripController.searchTrips);

  // Schedules
  router.get("/api/v1/schedules", scheduleController.getAllSchedules);
  router.get("/api/v1/schedules/:id", scheduleController.getScheduleById);
  router.post("/api/v1/schedules", scheduleController.createSchedule);
  router.put("/api/v1/schedules/:id", scheduleController.updateSchedule);
  router.delete("/api/v1/schedules/:id", scheduleController.deleteSchedule);
  router.post(
    "/api/v1/schedules/generate-trips",
    scheduleController.generateTrips
  );

  // Trip Prices
  router.get("/api/v1/trip-prices", tripPriceController.getAllTripPrices);
  router.get("/api/v1/trip-prices/:id", tripPriceController.getTripPriceById);
  router.post("/api/v1/trip-prices", tripPriceController.createTripPrice);
  router.put("/api/v1/trip-prices/:id", tripPriceController.updateTripPrice);
  router.delete("/api/v1/trip-prices/:id", tripPriceController.deleteTripPrice);

  /* ========== VEHICLE MANAGE ========== */
  router.get("/api/v1/vehicles", vehicleController.getAllVehicles);
  router.get("/api/v1/vehicles/:id", vehicleController.getVehicleById);
  router.post("/api/v1/vehicles", vehicleController.createVehicle);
  router.put("/api/v1/vehicles/:id", vehicleController.updateVehicle);
  router.delete("/api/v1/vehicles/:id", vehicleController.deleteVehicle);

  router.get(
    "/api/v1/vehicle-status",
    vehicleStatusController.getAllVehicleStatus
  );
  router.get(
    "/api/v1/vehicle-status/:vehicleId",
    vehicleStatusController.getStatusByVehicleId
  );
  router.post(
    "/api/v1/vehicle-status",
    vehicleStatusController.updateVehicleStatus
  );
  router.delete(
    "/api/v1/vehicle-status/:id",
    vehicleStatusController.deleteVehicleStatus
  );

  router.get(
    "/api/v1/driver-schedules",
    driverScheduleController.getAllDriverSchedules
  );
  router.get(
    "/api/v1/driver-schedules/:id",
    driverScheduleController.getDriverScheduleById
  );
  router.post(
    "/api/v1/driver-schedules",
    driverScheduleController.createDriverSchedule
  );
  router.put(
    "/api/v1/driver-schedules",
    driverScheduleController.updateDriverSchedule
  );
  router.delete(
    "/api/v1/driver-schedules/:id",
    driverScheduleController.deleteDriverSchedule
  );
  router.get("/api/v1/drivers/all", driverScheduleController.getAllDrivers);

  /* ========== BOOKING MANAGE ========== */
  router.get("/api/v1/bookings", bookingController.getAllBookings);
  router.get("/api/v1/bookings/:id", bookingController.getBookingById);
  router.post("/api/v1/bookings", bookingController.createBooking);
  router.put("/api/v1/bookings", bookingController.updateBookingStatus);
  router.delete("/api/v1/bookings/:id", bookingController.deleteBooking);

  // Booking details
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

  router.get(
    "/api/v1/bookings/:bookingId/seats",
    bookingSeatController.getSeatsByBooking
  );
  router.post("/api/v1/bookings/seats", bookingSeatController.addSeat);
  router.put("/api/v1/bookings/seats", bookingSeatController.updateSeat);
  router.delete("/api/v1/bookings/seats/:id", bookingSeatController.deleteSeat);

  // Booking Invoice
  router.get("/api/v1/bookings/:id/invoice", invoiceController.downloadInvoice);

  // Booking Payment
  router.get(
    "/api/v1/bookings/payments/all",
    bookingPaymentController.getAllPayments
  );
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

  // Booking Notification
  router.get(
    "/api/v1/bookings-notification/new",
    BookingNotification.getNewBookings
  );

  /* ========== REPORTS ========== */
  router.get("/api/v1/reports/revenue", reportController.getRevenueReport);
  router.get(
    "/api/v1/reports/ticket-sales",
    reportController.getTicketSalesReport
  );
  router.get(
    "/api/v1/reports/cancellation-rate",
    reportController.getCancellationRateReport
  );

  /* ========== PAYMENT UTILS ========== */
  router.post(
    "/api/v1/payments/create-banking-qr",
    paymentController.createBankingQR
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
