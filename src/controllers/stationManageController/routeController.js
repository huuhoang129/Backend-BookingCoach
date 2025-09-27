import routeService from "../../services/stationManageServices/routeServices";

let getAllRoutes = async (req, res) => {
  try {
    let routes = await routeService.getAllRoutes();
    return res.status(200).json(routes);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getRouteById = async (req, res) => {
  try {
    let routeId = req.params.id;
    let result = await routeService.getRouteById(routeId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let createRoute = async (req, res) => {
  try {
    let route = await routeService.createRoute(req.body);
    return res.status(200).json(route);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let updateRoute = async (req, res) => {
  try {
    const result = await routeService.updateRoute({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error("updateRoute error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let deleteRoute = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await routeService.deleteRoute(id);
  return res.status(200).json(message);
};

export default {
  getAllRoutes,
  getRouteById,
  createRoute,
  deleteRoute,
  updateRoute,
};
