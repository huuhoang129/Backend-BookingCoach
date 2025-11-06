import { getInvoiceFile } from "../../services/paymentManageService/invoiceService.js";

/**
 * Tải hóa đơn PDF theo bookingId
 */
const downloadInvoice = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await getInvoiceFile(bookingId); // Lấy hóa đơn từ service
    if (result.errCode === 1) {
      return res.status(404).send(result.errMessage);
    }
    if (result.errCode !== 0) {
      return res.status(500).send(result.errMessage);
    }
    // Tải file PDF
    return res.download(result.filePath, `Hoa-don-ve-xe-${bookingId}.pdf`);
  } catch (e) {
    console.error("InvoiceController - downloadInvoice error:", e);
    return res.status(500).send("Lỗi hệ thống");
  }
};

export default { downloadInvoice };
