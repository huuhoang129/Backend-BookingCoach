require("dotenv").config();
import nodemailer from "nodemailer";

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

module.exports = {
  sendPasswordResetEmail,
};
