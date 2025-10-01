import bookingSeatService from "../../services/bookingManageServices/bookingSeatService.js";

let getSeatsByBooking = async (req, res) => {
  try {
    let bookingId = req.params.bookingId;
    let result = await bookingSeatService.getSeatsByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getSeatsByBooking error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let addSeat = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingSeatService.addSeat(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("addSeat error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let updateSeat = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingSeatService.updateSeat(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateSeat error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let deleteSeat = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await bookingSeatService.deleteSeat(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteSeat error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

export default {
  getSeatsByBooking,
  addSeat,
  updateSeat,
  deleteSeat,
};
