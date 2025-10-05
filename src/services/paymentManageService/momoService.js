import https from "https";
import crypto from "crypto";
import db from "../../models/index.js";
import bookingPaymentServices from "../bookingManageServices/bookingPaymentService.js";

const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE || "MOMO";
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
const MOMO_SECRET_KEY =
  process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const MOMO_RETURN_URL =
  process.env.MOMO_RETURN_URL || "https://webhook.site/return-demo";
const MOMO_IPN_URL =
  process.env.MOMO_IPN_URL || "https://webhook.site/return-demo";

export const createMoMoPayment = async ({ bookingId, amount }) => {
  const orderId = bookingId + Date.now();
  const requestId = orderId;
  const orderInfo = `Thanh toán vé xe #${bookingId}`;
  const requestType = "captureWallet";
  const extraData = "";

  // Cập nhật trạng thái thanh toán (pending)
  await db.BookingPayments.update(
    { transactionCode: orderId, amount, status: "PENDING" },
    { where: { bookingId, method: "MOMO" } }
  );

  const rawSignature =
    `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}` +
    `&ipnUrl=${MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}` +
    `&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_RETURN_URL}` +
    `&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const body = JSON.stringify({
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: MOMO_RETURN_URL,
    ipnUrl: MOMO_IPN_URL,
    extraData,
    requestType,
    signature,
    lang: "vi",
  });

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

export const handleMoMoIPN = async (params) => {
  const { resultCode, orderId } = params;

  const payment = await db.BookingPayments.findOne({
    where: { transactionCode: orderId },
  });

  if (!payment) {
    return { resultCode: 1, message: "Payment not found" };
  }

  await bookingPaymentServices.updatePaymentStatus({
    paymentId: payment.id,
    status: resultCode === 0 ? "SUCCESS" : "FAILED",
    transactionCode: orderId,
  });

  return { resultCode: 0, message: "Success" };
};
