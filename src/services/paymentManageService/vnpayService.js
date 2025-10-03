import moment from "moment";
import qs from "qs";
import crypto from "crypto";
import db from "../../models/index.js";
import bookingPaymentServices from "../bookingManageServices/bookingPaymentService.js";

// Hàm sort object theo yêu cầu VNPAY
function sortObject(obj) {
  let sorted = {};
  let str = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let i = 0; i < str.length; i++) {
    sorted[str[i]] = encodeURIComponent(obj[str[i]]).replace(/%20/g, "+");
  }
  return sorted;
}

// Tạo URL thanh toán VNPAY
export const createVNPayPayment = async ({
  bookingId,
  amount,
  bankCode,
  ipAddr,
}) => {
  const orderId = bookingId + Date.now(); // transactionCode duy nhất cho lần thanh toán này

  // Update record payment PENDING hiện có
  await db.BookingPayments.update(
    { transactionCode: orderId, amount, status: "PENDING" },
    { where: { bookingId, method: "VNPAY" } }
  );

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan ve xe - booking ${bookingId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: process.env.VNP_RETURNURL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
  };
  if (bankCode) vnp_Params["vnp_BankCode"] = bankCode;

  // sort & sign
  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
  vnp_Params["vnp_SecureHash"] = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  const paymentUrl =
    process.env.VNP_URL + "?" + qs.stringify(vnp_Params, { encode: false });
  return paymentUrl;
};

// Kiểm tra chữ ký
export const verifyVNPay = (vnp_Params) => {
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = crypto
    .createHmac("sha512", process.env.VNP_HASHSECRET)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  return secureHash === signed;
};

// Xử lý khi user quay về từ VNPAY
export const handleVNPayReturn = async (vnp_Params) => {
  if (!verifyVNPay(vnp_Params)) {
    return { success: false, code: "97" };
  }

  const rspCode = vnp_Params["vnp_ResponseCode"];
  const orderId = vnp_Params["vnp_TxnRef"];

  // tìm payment theo transactionCode
  const payment = await db.BookingPayments.findOne({
    where: { transactionCode: orderId },
  });

  if (!payment) {
    return { success: false, code: "01" }; // payment not found
  }

  // gọi sang bookingPaymentServices.updatePaymentStatus
  await bookingPaymentServices.updatePaymentStatus({
    paymentId: payment.id,
    status: rspCode === "00" ? "SUCCESS" : "FAILED",
    transactionCode: orderId,
  });

  return { success: true, code: rspCode };
};

// Xử lý IPN (callback server-to-server)
export const handleVNPayIPN = async (vnp_Params) => {
  if (!verifyVNPay(vnp_Params)) {
    return { RspCode: "97", Message: "Checksum failed" };
  }

  const rspCode = vnp_Params["vnp_ResponseCode"];
  const orderId = vnp_Params["vnp_TxnRef"];

  const payment = await db.BookingPayments.findOne({
    where: { transactionCode: orderId },
  });

  if (!payment) {
    return { RspCode: "01", Message: "Payment not found" };
  }

  await bookingPaymentServices.updatePaymentStatus({
    paymentId: payment.id,
    status: rspCode === "00" ? "SUCCESS" : "FAILED",
    transactionCode: orderId,
  });

  return { RspCode: "00", Message: "Success" };
};
