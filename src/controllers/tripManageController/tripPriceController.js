import tripPriceService from "../../services/tripManageServices/tripPriceServices";

let getAllTripPrices = async (req, res) => {
  try {
    let result = await tripPriceService.getAllTripPrices();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getAllTripPrices error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let getTripPriceById = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await tripPriceService.getTripPriceById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getTripPriceById error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let createTripPrice = async (req, res) => {
  try {
    let result = await tripPriceService.createTripPrice(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createTripPrice error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let updateTripPrice = async (req, res) => {
  try {
    let result = await tripPriceService.updateTripPrice({
      id: req.params.id,
      ...req.body,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateTripPrice error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let deleteTripPrice = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await tripPriceService.deleteTripPrice(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteTripPrice error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

export default {
  getAllTripPrices,
  getTripPriceById,
  createTripPrice,
  updateTripPrice,
  deleteTripPrice,
};
