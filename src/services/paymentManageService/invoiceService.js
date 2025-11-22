import db from "../../models/index.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

// Sinh PDF invoice
let generateInvoice = async (booking, payment) => {
  const dir = path.resolve("invoices");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(dir, `${booking.bookingCode}.pdf`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Fonts (nếu không có thì dùng default PDFKit)
  const fontRegular = path.resolve("src/assets/fonts/Roboto-Regular.ttf");
  const fontBold = path.resolve("src/assets/fonts/Roboto-Bold.ttf");
  if (fs.existsSync(fontRegular)) doc.registerFont("Regular", fontRegular);
  if (fs.existsSync(fontBold)) doc.registerFont("Bold", fontBold);

  // Header
  doc.rect(0, 0, doc.page.width, 80).fill("#1976d2");
  doc
    .fillColor("white")
    .font("Bold")
    .fontSize(22)
    .text("BOOKING COACH", 50, 25);
  doc
    .fillColor("white")
    .font("Regular")
    .fontSize(12)
    .text("Hóa đơn đặt vé", 50, 55);
  doc.fillColor("black");
  doc.moveDown(3);

  // QR chỉ chứa bookingCode, status sẽ được lấy realtime từ server khi quét
  const qrData = {
    bookingCode: booking.bookingCode,
  };

  const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

  // BookingCode + QR
  doc.font("Bold").fontSize(14).text(`Mã đặt vé: ${booking.bookingCode}`);
  doc.image(
    Buffer.from(qrImage.split(",")[1], "base64"),
    doc.page.width - 170,
    100,
    {
      fit: [100, 100],
    }
  );
  doc.moveDown(3);

  // Thông tin khách hàng
  doc.font("Bold").text("Thông tin khách hàng", { underline: true });
  doc
    .font("Regular")
    .text(`Tên khách: ${booking.customers?.[0]?.fullName || "N/A"}`)
    .text(`SĐT: ${booking.customers?.[0]?.phone || "N/A"}`)
    .text(`Email: ${booking.customers?.[0]?.email || "N/A"}`)
    .moveDown(1);

  // Thông tin chuyến đi
  doc.font("Bold").text("Thông tin chuyến đi", { underline: true });

  const routeText = `Tuyến: ${
    booking.trip?.route?.fromLocation?.nameLocations || "N/A"
  } --> ${booking.trip?.route?.toLocation?.nameLocations || "N/A"}`;

  const dateTimeText = `Ngày giờ: ${booking.trip?.startDate || ""} ${
    booking.trip?.startTime || ""
  }`;

  const seatsText = `Ghế: ${
    booking.seats?.map((s) => s.seat?.name).join(", ") || "N/A"
  }`;

  // Lấy thông tin xe
  const vehicle = booking.trip?.vehicle;
  const vehicleTypeMap = {
    NORMAL: "Ghế ngồi",
    SLEEPER: "Giường nằm",
    DOUBLESLEEPER: "Giường đôi",
    LIMOUSINE: "Limousine",
  };

  const vehicleTypeCode = vehicle?.type;
  const vehicleTypeLabel =
    (vehicleTypeCode && vehicleTypeMap[vehicleTypeCode]) || "N/A";

  const licensePlate = vehicle?.licensePlate || "N/A";
  const vehicleName = vehicle?.name || "";

  doc
    .font("Regular")
    .text(routeText)
    .text(dateTimeText)
    .text(seatsText)
    .text(
      `Loại xe: ${vehicleTypeLabel}${vehicleName ? ` (${vehicleName})` : ""}`
    )
    .text(`Biển số: ${licensePlate}`)
    .moveDown(1);

  // Thông tin thanh toán
  doc.font("Bold").text("Thanh toán", { underline: true });
  doc
    .font("Regular")
    .text(`Phương thức: ${payment?.method || "N/A"}`)
    .text(`Tổng tiền: ${Number(booking.totalAmount).toLocaleString()} VND`)
    .moveDown(2);

  // Footer
  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("gray")
    .text("Quét mã QR tại bến xe để xác nhận thanh toán.", { align: "center" })
    .moveDown(0.5)
    .text("Cảm ơn quý khách đã sử dụng dịch vụ Booking Coach!", {
      align: "center",
    });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", reject);
  });
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
