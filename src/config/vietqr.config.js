export const VietQRConfig = {
  base: "https://img.vietqr.io/image",
  bankCode: process.env.PAY_BANK_CODE || "vcb",
  accountNo: process.env.PAY_ACCOUNT_NO,
  accountName: process.env.PAY_ACCOUNT_NAME,
  expireMin: Number(process.env.PAY_QR_EXPIRE_MIN || 10),
};
