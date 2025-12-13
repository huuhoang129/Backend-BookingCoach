// src/controllers/paymentManageController/invoiceController.js
import { getInvoiceFile } from "../../services/paymentManageService/invoiceService.js";

// Tải hóa đơn dưới dạng file ảnh
const downloadInvoice = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await getInvoiceFile(bookingId);

    if (result.errCode === 1) {
      return res.status(404).send(result.errMessage);
    }
    if (result.errCode !== 0) {
      return res.status(500).send(result.errMessage);
    }

    // Trả file ảnh cho client
    return res.download(result.filePath, `Hoa-don-ve-xe-${bookingId}.png`);
  } catch (e) {
    // Lỗi khi xử lý tải hóa đơn
    console.error("Lỗi khi tải hóa đơn ảnh:", e);
    return res.status(500).send("Lỗi hệ thống");
  }
};

export default { downloadInvoice };
