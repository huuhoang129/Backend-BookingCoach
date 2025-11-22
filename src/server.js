// src/server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import dotenv from "dotenv";
import cron from "node-cron";
import { cleanupExpiredBookings } from "./ultis/cleanupExpiredBookings.utils.js";
import { updateFinishedTrips } from "./ultis/tripStatusUpdater.utils.js";

dotenv.config();
const app = express();

// ===== Cấu hình CORS =====
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ===== Xử lý body request =====
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ===== Static & View Engine =====
app.use("/upload", express.static(path.join(process.cwd(), "public/upload")));
viewEngine(app);
initWebRoutes(app);

// ===== Kết nối Database =====
connectDB();

// ===== CRON JOBS =====

// Cron dọn booking hết hạn (mỗi phút)
cron.schedule("*/1 * * * *", async () => {
  const start = new Date();
  console.log(
    `\n[Cron] Bắt đầu kiểm tra booking hết hạn lúc: ${start.toLocaleTimeString()}`
  );

  try {
    const result = await cleanupExpiredBookings();
    console.log(
      `[Cron] Đã xử lý ${result?.expiredCount || 0} booking hết hạn.`
    );
  } catch (err) {
    console.error("[Cron] Lỗi khi chạy cleanupExpiredBookings:", err.message);
  }

  const end = new Date();
  console.log(
    `[Cron] Hoàn tất cleanupExpiredBookings lúc ${end.toLocaleTimeString()} | Thời gian: ${
      (end - start) / 1000
    }s`
  );
});

// Cron cập nhật trạng thái chuyến xe (mỗi 2 phút)
cron.schedule("*/2 * * * *", async () => {
  const start = new Date();
  console.log(
    `\n[Cron] Bắt đầu kiểm tra chuyến xe hoàn thành lúc: ${start.toLocaleTimeString()}`
  );

  try {
    const result = await updateFinishedTrips();
    console.log(
      `[Cron] Đã cập nhật ${
        result?.updatedCount || 0
      } chuyến sang trạng thái FULL.`
    );
  } catch (err) {
    console.error("[Cron] Lỗi khi chạy updateFinishedTrips:", err.message);
  }

  const end = new Date();
  console.log(
    `[Cron] Hoàn tất updateFinishedTrips lúc ${end.toLocaleTimeString()} | Thời gian: ${
      (end - start) / 1000
    }s`
  );
});

// ===== Khởi động server =====
const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Backend đang chạy tại cổng: " + port);
});
