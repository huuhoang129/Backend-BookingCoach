// src/services/stationManageServices/routeServices.js
import db from "../../models/index.js";

// Lấy toàn bộ tuyến đường
let getAllRoutes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy danh sách tuyến đường kèm điểm đi / điểm đến
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

      // Chuyển ảnh từ Buffer → base64 để trả về frontend
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
        errMessage: "Lấy danh sách tuyến đường thành công",
        data: routes,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy chi tiết tuyến đường theo ID
let getRouteById = (routeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!routeId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số routeId",
          data: null,
        });
      }

      const route = await db.CoachRoute.findOne({
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
          errMessage: "Không tìm thấy tuyến đường",
          data: null,
        });
      }

      // Convert ảnh
      if (route.imageRouteCoach) {
        const base64Str = route.imageRouteCoach.toString("base64");
        route.imageRouteCoach = `data:image/png;base64,${base64Str}`;
      }

      resolve({
        errCode: 0,
        errMessage: "Lấy tuyến đường thành công",
        data: route,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo tuyến đường mới
let createRoute = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.fromLocationId || !data.toLocationId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu dữ liệu bắt buộc",
        });
      }

      // Kiểm tra trùng tuyến
      const existingRoute = await db.CoachRoute.findOne({
        where: {
          fromLocationId: data.fromLocationId,
          toLocationId: data.toLocationId,
        },
      });

      if (existingRoute) {
        return resolve({
          errCode: 2,
          errMessage: "Tuyến đường đã tồn tại",
        });
      }

      // Tạo mới
      await db.CoachRoute.create({
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        imageRouteCoach: data.imageRouteCoach
          ? Buffer.from(data.imageRouteCoach, "base64")
          : null,
      });

      resolve({
        errCode: 0,
        errMessage: "Tạo tuyến đường thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật tuyến đường
let updateRoute = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.fromLocationId || !data.toLocationId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu dữ liệu bắt buộc",
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
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy tuyến đường",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Cập nhật tuyến đường thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa tuyến đường
let deleteRoute = (routeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const route = await db.CoachRoute.findOne({ where: { id: routeId } });

      if (!route) {
        return resolve({
          errCode: 2,
          errMessage: "Tuyến đường không tồn tại",
        });
      }

      await db.CoachRoute.destroy({ where: { id: routeId } });

      resolve({
        errCode: 0,
        errMessage: "Xóa tuyến đường thành công",
      });
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
