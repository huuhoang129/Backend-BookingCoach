// src/controllers/driverProfileController.js
import driverProfileService from "../../services/driverManageServices/driverProfileService.js";

let getDriverProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("GET DRIVER PROFILE - userId:", userId);

    const result = await driverProfileService.getDriverProfileService(userId);

    return res.status(200).json(result);
  } catch (error) {
    console.log("GET DRIVER PROFILE ERROR FULL:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi server",
      data: null,
    });
  }
};

let updateDriverProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await driverProfileService.updateDriverProfileService(
      userId,
      req.body
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log("UPDATE DRIVER PROFILE ERROR:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi server",
      data: null,
    });
  }
};

export default {
  getDriverProfile,
  updateDriverProfile,
};
