// paymentServices.js
import db from "../../models/index.js";
import axios from "axios";
import bookingPaymentServices from "../bookingManageServices/bookingPaymentService";

let createBankingQR = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    // Dùng core service để tạo record payment
    const addInfo = `BOOKING-${data.bookingId}`;
    const payment = await bookingPaymentServices.createPayment(
      { ...data, method: "BANKING", transactionCode: addInfo },
      t
    );

    await t.commit();

    // Sau đó mới gọi API VietQR
    const payload = {
      accountNo: process.env.VIETQR_ACCOUNT_NO,
      accountName: process.env.VIETQR_ACCOUNT_NAME,
      acqId: Number(process.env.VIETQR_BANK_ID),
      amount: Number(data.amount),
      addInfo,
      format: "image",
    };

    const response = await axios.post(
      "https://api.vietqr.io/v2/generate",
      payload
    );

    if (response.data.code !== "00") {
      return {
        errCode: 3,
        errMessage: response.data.desc || "VietQR API error",
      };
    }

    return {
      errCode: 0,
      data: {
        paymentId: payment.id,
        qrCode: response.data.data.qrCode,
        addInfo,
      },
    };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export default {
  createBankingQR,
};
