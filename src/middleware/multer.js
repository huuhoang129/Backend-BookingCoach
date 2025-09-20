import multer from "multer";
import path from "path";
import fs from "fs";

export const createMulter = (folder) => {
  const uploadDir = path.join(process.cwd(), "public/upload", folder);

  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });

  return multer({ storage });
};
