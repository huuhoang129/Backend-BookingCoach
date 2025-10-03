import { getInvoiceFile } from "../../services/paymentManageService/invoiceService.js";

let downloadInvoice = async (req, res) => {
  try {
    const result = await getInvoiceFile(req.params.id);

    if (result.errCode === 1) {
      return res.status(404).send(result.errMessage);
    }
    if (result.errCode !== 0) {
      return res.status(500).send(result.errMessage);
    }

    res.download(result.filePath, `Hóa đơn vé xe-${req.params.id}.pdf`);
  } catch (e) {
    console.error("downloadInvoice error:", e);
    res.status(500).send("Internal server error");
  }
};

export default { downloadInvoice };
