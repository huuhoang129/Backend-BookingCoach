import newsService from "../../services/systemManageServices/newServices";

let getAllNews = async (req, res) => {
  try {
    let result = await newsService.getAllNews();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getAllNews error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getNewsById = async (req, res) => {
  try {
    let newsId = req.params.id;
    let result = await newsService.getNewsById(newsId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getNewsById error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let createNews = async (req, res) => {
  try {
    let result = await newsService.createNews(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createNews error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateNews = async (req, res) => {
  try {
    let result = await newsService.updateNews(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateNews error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let deleteNews = async (req, res) => {
  try {
    let newsId = req.params.id;
    let result = await newsService.deleteNews(newsId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteNews error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
