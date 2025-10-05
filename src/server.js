import express from "express";
import bodyParser from "body-parser";
import path from "path";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import dotenv from "dotenv";
import cron from "node-cron";
import { cleanupExpiredBookings } from "./ultis/cleanupExpiredBookings.utils";

dotenv.config();
const app = express();

// ===== CORS =====
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

// ===== Body Parser =====
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ===== Static & View =====
app.use("/upload", express.static(path.join(process.cwd(), "public/upload")));
viewEngine(app);
initWebRoutes(app);

// ===== Database =====
connectDB();

// ===== CRON JOB =====
cron.schedule("*/1 * * * *", async () => {
  const start = new Date();
  console.log(
    `\n🕒 [Cron] Bắt đầu kiểm tra booking hết hạn: ${start.toLocaleTimeString()}`
  );

  try {
    const result = await cleanupExpiredBookings();
    console.log(
      `✅ [Cron] Đã xử lý ${result?.expiredCount || 0} booking hết hạn.`
    );
  } catch (err) {
    console.error(
      "❌ [Cron] Lỗi khi chạy cleanupExpiredBookings:",
      err.message
    );
  }

  const end = new Date();
  console.log(
    `🔚 [Cron] Hoàn tất lúc ${end.toLocaleTimeString()} | Thời gian: ${
      (end - start) / 1000
    }s`
  );
});

// ===== Start server =====
const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("🚀 Backend NodeJs is running on port: " + port);
});
