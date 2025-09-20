export const handleUploadService = (req, folder) => {
  if (!req.file) {
    return {
      errCode: 1,
      errMessage: "No file uploaded",
    };
  }

  return {
    errCode: 0,
    errMessage: "Upload success",
    fileName: req.file.filename,
    url: `${process.env.BACKEND_URL}/upload/${folder}/${req.file.filename}`,
  };
};
