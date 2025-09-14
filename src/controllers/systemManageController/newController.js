import newServices from "../../services/systemManageServices/newServices.js";

let getAllNews = async (req, res) => {
  try {
    let news = await newServices.getAllNews();
    return res.status(200).json(news);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getNewsById = async (req, res) => {
  try {
    let infor = await newServices.getNewsById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createNews = async (req, res) => {
  try {
    let infor = await newServices.createNews(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let editNews = async (req, res) => {
  let data = req.body;
  let message = await newServices.updateNews(data);
  return res.status(200).json(message);
};

let deleteNews = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await newServices.deleteNews(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  editNews,
  deleteNews,
};
