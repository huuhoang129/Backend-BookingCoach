import coachTripServices from "../../services/stationManageServices/coachTripServices";

let getAllTrips = async (req, res) => {
  try {
    let result = await coachTripServices.getAllTrips();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getAllTrips error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getTripById = async (req, res) => {
  try {
    let tripId = req.params.id;
    let result = await coachTripServices.getTripById(tripId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getTripById error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let createTrip = async (req, res) => {
  try {
    let data = req.body;
    let result = await coachTripServices.createTrip(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createTrip error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateTrip = async (req, res) => {
  try {
    let data = req.body;
    let result = await coachTripServices.updateTrip(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateTrip error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let deleteTrip = async (req, res) => {
  try {
    let tripId = req.params.id;
    let result = await coachTripServices.deleteTrip(tripId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteTrip error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let searchTrips = async (req, res) => {
  try {
    let { fromLocationId, toLocationId, startDate, endDate } = req.query;

    let result = await coachTripServices.findTripsByRouteAndDate(
      Number(fromLocationId),
      Number(toLocationId),
      startDate,
      endDate
    );

    return res.status(200).json(result);
  } catch (e) {
    console.error("searchTrips error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

export default {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  searchTrips,
};
