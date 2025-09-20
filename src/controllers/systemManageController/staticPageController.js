import staticPageServices from "../../services/systemManageServices/staticPageServices";

let getStaticPage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    if (!pageKey) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing parameter: pageKey",
      });
    }

    const data = await staticPageServices.getStaticPage(pageKey);
    return res.status(200).json(data);
  } catch (e) {
    console.error("❌ Error in getStaticPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateStaticPage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { blocks } = req.body;

    if (!pageKey || !Array.isArray(blocks)) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing parameter: pageKey or blocks",
      });
    }

    const result = await staticPageServices.updateStaticPage(pageKey, blocks);
    return res.status(200).json(result);
  } catch (e) {
    console.error("❌ Error in updateStaticPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getStaticPage,
  updateStaticPage,
};
