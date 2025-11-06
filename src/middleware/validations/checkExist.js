let checkExist = (Model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const record = await Model.findByPk(id);

      if (!record)
        return res.status(404).json({
          errCode: 1,
          message: `Không tìm thấy bản ghi có id = ${id}`,
        });

      req.record = record;
      next();
    } catch (err) {
      return res.status(500).json({
        errCode: 2,
        message: "Lỗi máy chủ",
        error: err.message,
      });
    }
  };
};

export default checkExist;
