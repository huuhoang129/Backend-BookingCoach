import db from "../../models/index.js";

let getAllRoutes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let routes = await db.CoachRoute.findAll({
        include: [
          {
            model: db.Location,
            as: "fromLocation",
            include: [{ model: db.Province, as: "province" }],
          },
          {
            model: db.Location,
            as: "toLocation",
            include: [{ model: db.Province, as: "province" }],
          },
        ],
        order: [["id", "ASC"]],
        raw: false,
        nest: true,
      });

      if (routes && routes.length > 0) {
        routes = routes.map((item) => {
          if (item.imageRouteCoach) {
            const base64Str = item.imageRouteCoach.toString("base64");
            item.imageRouteCoach = `data:image/png;base64,${base64Str}`;
          }
          return item;
        });
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: routes,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getRouteById = (routeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!routeId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: routeId",
          data: null,
        });
      }

      let route = await db.CoachRoute.findOne({
        where: { id: routeId },
        include: [
          {
            model: db.Location,
            as: "fromLocation",
            include: [{ model: db.Province, as: "province" }],
          },
          {
            model: db.Location,
            as: "toLocation",
            include: [{ model: db.Province, as: "province" }],
          },
        ],
        raw: false,
        nest: true,
      });

      if (!route) {
        return resolve({
          errCode: 2,
          errMessage: "Route not found",
          data: null,
        });
      }

      if (route.imageRouteCoach) {
        const base64Str = route.imageRouteCoach.toString("base64");
        route.imageRouteCoach = `data:image/png;base64,${base64Str}`;
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: route,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createRoute = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.fromLocationId || !data.toLocationId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      let existingRoute = await db.CoachRoute.findOne({
        where: {
          fromLocationId: data.fromLocationId,
          toLocationId: data.toLocationId,
        },
      });

      if (existingRoute) {
        return resolve({
          errCode: 2,
          errMessage: "Route already exists with the same from, to",
        });
      }

      await db.CoachRoute.create({
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        imageRouteCoach: data.imageRouteCoach
          ? Buffer.from(data.imageRouteCoach, "base64") // 👈 convert base64 → Buffer
          : null,
      });

      resolve({
        errCode: 0,
        errMessage: "Route created successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateRoute = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.fromLocationId || !data.toLocationId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      const [updated] = await db.CoachRoute.update(
        {
          fromLocationId: data.fromLocationId,
          toLocationId: data.toLocationId,
          imageRouteCoach: data.imageRouteCoach
            ? Buffer.from(data.imageRouteCoach, "base64")
            : undefined,
        },
        { where: { id: data.id } }
      );

      if (updated === 0) {
        return resolve({ errCode: 2, errMessage: "Route not found" });
      }

      return resolve({ errCode: 0, errMessage: "Route updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteRoute = (routeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let route = await db.CoachRoute.findOne({ where: { id: routeId } });
      if (!route) {
        resolve({
          errCode: 2,
          errMessage: "Route doesn't exist",
        });
      } else {
        await db.CoachRoute.destroy({ where: { id: routeId } });
        resolve({
          errCode: 0,
          errMessage: "Route deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
