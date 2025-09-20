import { createMulter } from "../middleware/multer.js";
import { handleUploadService } from "../services/uploadService";

export const uploadFile = (req, res) => {
  const folder = req.params.folder;
  const upload = createMulter(folder).single("file");

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ errCode: 1, errMessage: err.message });
    }
    const result = handleUploadService(req, folder);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  });
};
