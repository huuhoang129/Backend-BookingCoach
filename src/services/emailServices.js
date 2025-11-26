// src/services/emailServices.js
require("dotenv").config();
import nodemailer from "nodemailer";

// Tạo transporter để gửi email
let createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

// Gửi email khôi phục mật khẩu
let sendPasswordResetEmail = async (dataSend) => {
  let transporter = createTransporter();

  await transporter.sendMail({
    from: '"Booking Coach" <no-reply@bookingcoach.com>',
    to: dataSend.receiverEmail,
    subject: "Mã OTP khôi phục mật khẩu - Booking Coach",
    html: `
      <h3>Xin chào,</h3>
      <p>Bạn vừa yêu cầu khôi phục mật khẩu cho tài khoản Booking Coach.</p>
      <p>Mã OTP của bạn là: <strong>${dataSend.otp}</strong></p>
      <p>Mã này sẽ hết hạn sau 5 phút.</p>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    `,
  });
};

// Gửi email xác nhận thanh toán thành công
let sendPaymentSuccessEmail = async (dataSend) => {
  let transporter = createTransporter();

  const seats = dataSend.seats?.length ? dataSend.seats.join(", ") : "Không rõ";
  const pickup = dataSend.pickup || "Chưa chọn";
  const dropoff = dataSend.dropoff || "Chưa chọn";
  const vehicleName = dataSend.vehicleName || "Không rõ";
  const licensePlate = dataSend.licensePlate || "Không rõ";

  await transporter.sendMail({
    from: '"Booking Coach" <no-reply@bookingcoach.com>',
    to: dataSend.receiverEmail,
    subject: `Xác nhận thanh toán thành công - ${dataSend.bookingCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color:#2e7d32">Thanh toán thành công 🎉</h2>
        <p>Xin chào <b>${dataSend.fullName}</b>,</p>
        <p>Đơn đặt vé của bạn đã được xác nhận thành công.</p>

        
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Mã đặt vé</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${
                dataSend.bookingCode
              }</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Số tiền</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${Number(
                dataSend.totalAmount
              ).toLocaleString()} VND</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Phương thức</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${
                dataSend.method
              }</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Ghế</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${seats}</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Loại xe</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${vehicleName}</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Biển số</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${licensePlate}</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Điểm đón</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${pickup}</td></tr>

          <tr><td style="padding:8px; border:1px solid #ddd;"><b>Điểm trả</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${dropoff}</td></tr>
        </table>

        <p style="margin-top:20px;">Cảm ơn bạn đã sử dụng dịch vụ của <b>Booking Coach</b>.</p>
        <p style="color:#888; font-size:12px;">Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hỗ trợ.</p>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendPaymentSuccessEmail,
};
