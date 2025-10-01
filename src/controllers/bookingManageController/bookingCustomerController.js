import bookingCustomerService from "../../services/bookingManageServices/bookingCustomerService.js";

let getCustomersByBooking = async (req, res) => {
  try {
    let bookingId = req.params.bookingId;
    let result = await bookingCustomerService.getCustomersByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getCustomersByBooking error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let addCustomer = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingCustomerService.addCustomer(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("addCustomer error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let updateCustomer = async (req, res) => {
  try {
    let data = req.body;
    let result = await bookingCustomerService.updateCustomer(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateCustomer error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let deleteCustomer = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await bookingCustomerService.deleteCustomer(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteCustomer error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

export default {
  getCustomersByBooking,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
