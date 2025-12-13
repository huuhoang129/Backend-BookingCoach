import { createCanvas, loadImage, registerFont } from "canvas";
import db from "../../models/index.js";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

registerFont("src/assets/fonts/Montserrat-Regular.ttf", {
  family: "Montserrat",
});
registerFont("src/assets/fonts/Montserrat-SemiBold.ttf", {
  family: "Montserrat",
  weight: "600",
});
registerFont("src/assets/fonts/Montserrat-Bold.ttf", {
  family: "Montserrat",
  weight: "bold",
});

// Sinh ảnh invoice
let generateInvoice = async (booking, payment) => {
  const dir = path.resolve("invoices");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const width = 900;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  /* Background */
  ctx.fillStyle = "#f2f4f7";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(40, 40, width - 80, height - 80);

  /* Header */
  ctx.fillStyle = "#4d940e";
  ctx.fillRect(40, 40, width - 80, 130);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px Montserrat";
  ctx.fillText("NHÀ XE HƯƠNG DƯƠNG", 70, 95);

  ctx.font = "600 18px Montserrat";
  ctx.fillText("E-TICKET / HÓA ĐƠN ĐIỆN TỬ", 70, 125);

  /* QR Code */
  const qrBuffer = await QRCode.toBuffer(
    JSON.stringify({ bookingCode: booking.bookingCode }),
    { width: 240, margin: 1 }
  );
  const qrImg = await loadImage(qrBuffer);

  ctx.fillStyle = "#fff";
  ctx.fillRect(width - 310, 70, 260, 260);
  ctx.drawImage(qrImg, width - 300, 80, 240, 240);

  /* Content */
  let y = 230;
  const left = 80;
  const line = (size = 20) => (y += size + 18);

  ctx.fillStyle = "#000";

  /* Booking code */
  ctx.font = "600 24px Montserrat";
  ctx.fillText(`Mã vé: ${booking.bookingCode}`, left, y);
  line(58);

  /* Customer */
  ctx.font = "600 22px Montserrat";
  ctx.fillText("👤 THÔNG TIN KHÁCH HÀNG", left, y);
  line(22);

  ctx.font = "20px Montserrat";
  ctx.fillText(`Họ tên: ${booking.customers?.[0]?.fullName || "N/A"}`, left, y);
  line();

  ctx.fillText(`SĐT: ${booking.customers?.[0]?.phone || "N/A"}`, left, y);
  line();

  ctx.fillText(`Email: ${booking.customers?.[0]?.email || "N/A"}`, left, y);
  line(58);

  /* Trip */
  ctx.font = "600 22px Montserrat";
  ctx.fillText("🚌 THÔNG TIN CHUYẾN ĐI", left, y);
  line(22);

  ctx.font = "20px Montserrat";
  ctx.fillText(
    `Tuyến: ${booking.trip?.route?.fromLocation?.nameLocations || "N/A"} → ${
      booking.trip?.route?.toLocation?.nameLocations || "N/A"
    }`,
    left,
    y
  );
  line();

  ctx.fillText(
    `Ngày giờ: ${booking.trip?.startDate || ""} ${
      booking.trip?.startTime || ""
    }`,
    left,
    y
  );
  line();

  ctx.fillText(
    `Ghế: ${booking.seats?.map((s) => s.seat?.name).join(", ") || "N/A"}`,
    left,
    y
  );
  line();

  ctx.fillText(`Loại xe: ${booking.trip?.vehicle?.name || "N/A"}`, left, y);
  line(58);

  /* Payment */
  ctx.font = "600 22px Montserrat";
  ctx.fillText("💳 THANH TOÁN", left, y);
  line(22);

  ctx.font = "20px Montserrat";
  ctx.fillText(`Phương thức: ${payment?.method || "N/A"}`, left, y);
  line(25);

  ctx.font = "bold 25px Montserrat";
  ctx.fillStyle = "#b20909ff";
  ctx.fillText(
    `TỔNG TIỀN: ${Number(booking.totalAmount).toLocaleString()} VND`,
    left,
    y
  );

  /* Footer */
  const footerY = height - 160;

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, footerY);
  ctx.lineTo(width - 60, footerY);
  ctx.stroke();

  ctx.fillStyle = "#555";
  ctx.font = "16px Montserrat";
  ctx.fillText("⚠️ Quét mã QR tại bến xe để xác nhận vé", left, footerY + 40);
  ctx.fillText(
    "Cảm ơn quý khách đã sử dụng dịch vụ của hãng xe khách Hương Dương ❤️",
    left,
    footerY + 70
  );

  /* Save */
  const filePath = path.join(dir, `${booking.bookingCode}.png`);
  fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

  return filePath;
};

// Lấy invoice file từ DB
let getInvoiceFile = async (bookingId) => {
  try {
    const booking = await db.Bookings.findOne({
      where: { id: bookingId },
      include: [
        { model: db.BookingCustomers, as: "customers" },
        {
          model: db.BookingSeats,
          as: "seats",
          include: [{ model: db.Seat, as: "seat" }],
        },
        {
          model: db.BookingPoints,
          as: "points",
          include: [{ model: db.Location, as: "Location" }],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              include: [
                { model: db.Location, as: "fromLocation" },
                { model: db.Location, as: "toLocation" },
              ],
            },
            {
              model: db.Vehicle,
              as: "vehicle",
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!booking) {
      return { errCode: 1, errMessage: "Booking not found" };
    }

    const payment = await db.BookingPayments.findOne({
      where: { bookingId: booking.id },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const filePath = await generateInvoice(booking, payment);
    return { errCode: 0, filePath };
  } catch (e) {
    console.error("getInvoiceFile error:", e);
    return { errCode: -1, errMessage: "Internal server error" };
  }
};

export { getInvoiceFile };
