import bookingPointService from "../../services/bookingManageServices/bookingPointService.js";

let getPointsByBooking = async (req, res) => {
  try {
    let bookingId = req.params.bookingId;
    let result = await bookingPointService.getPointsByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getPointsByBooking error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let addPoint = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingPointService.addPoint(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("addPoint error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let updatePoint = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingPointService.updatePoint(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updatePoint error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let deletePoint = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await bookingPointService.deletePoint(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deletePoint error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

export default {
  getPointsByBooking,
  addPoint,
  updatePoint,
  deletePoint,
};
