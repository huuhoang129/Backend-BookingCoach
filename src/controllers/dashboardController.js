import dashboardService from "../services/dashboardService.js";

const getOverview = async (req, res) => {
  try {
    const data = await dashboardService.getOverview();
    return res.status(200).json(data);
  } catch (e) {
    console.error("getOverview error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

const getCharts = async (req, res) => {
  try {
    const data = await dashboardService.getCharts();
    return res.status(200).json(data);
  } catch (e) {
    console.error("getCharts error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

const getTopRoutes = async (req, res) => {
  try {
    const data = await dashboardService.getTopRoutes();
    return res.status(200).json(data);
  } catch (e) {
    console.error("getTopRoutes error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

export default {
  getOverview,
  getCharts,
  getTopRoutes,
};
