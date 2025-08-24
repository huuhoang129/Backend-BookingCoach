import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
  // user
  router.post("/api/v1/register", userController.handleRegister);
  router.post("/api/v1/login", userController.handleLogin);

  return app.use("/", router);
};

module.exports = initWebRoutes;
