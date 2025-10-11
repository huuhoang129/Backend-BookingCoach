import db from "../../models/index.js";

let getAllDrivers = async () => {
  try {
    const drivers = await db.User.findAll({
      where: { role: "Driver" },
      attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
      order: [["firstName", "ASC"]],
    });

    return { errCode: 0, errMessage: "OK", data: drivers };
  } catch (e) {
    throw e;
  }
};

let getAllDriverSchedules = async () => {
  try {
    const schedules = await db.DriverSchedule.findAll({
      include: [
        {
          model: db.User,
          as: "driver",
          attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: {
                exclude: ["imageRouteCoach"],
              },
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
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data: schedules };
  } catch (e) {
    throw e;
  }
};

let getDriverSchedulesByUser = async (userId) => {
  try {
    if (!userId) return { errCode: 1, errMessage: "Missing parameter: userId" };

    const schedules = await db.DriverSchedule.findAll({
      where: { userId }, // ✅ lọc đúng tài xế đang đăng nhập
      include: [
        {
          model: db.User,
          as: "driver",
          attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: { exclude: ["imageRouteCoach"] },
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
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data: schedules };
  } catch (e) {
    console.error("❌ [getDriverSchedulesByUser] error:", e);
    throw e;
  }
};

let getDriverScheduleById = async (id) => {
  try {
    if (!id) return { errCode: 1, errMessage: "Missing parameter: id" };

    const schedule = await db.DriverSchedule.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: "driver",
          attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: { exclude: ["imageRouteCoach"] },
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!schedule)
      return { errCode: 2, errMessage: "Driver schedule not found" };
    return { errCode: 0, errMessage: "OK", data: schedule };
  } catch (e) {
    throw e;
  }
};

let createDriverSchedule = async (data) => {
  try {
    if (!data.userId || !data.coachTripId) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    await db.DriverSchedule.create({
      userId: data.userId,
      coachTripId: data.coachTripId,
      note: data.note || null,
    });

    return { errCode: 0, errMessage: "Driver schedule created successfully" };
  } catch (e) {
    throw e;
  }
};

let updateDriverSchedule = async (data) => {
  try {
    if (!data.id) return { errCode: 1, errMessage: "Missing id" };

    const [updated] = await db.DriverSchedule.update(
      {
        userId: data.userId,
        coachTripId: data.coachTripId,
        note: data.note,
      },
      { where: { id: data.id } }
    );

    if (!updated)
      return { errCode: 2, errMessage: "Driver schedule not found" };
    return { errCode: 0, errMessage: "Driver schedule updated successfully" };
  } catch (e) {
    throw e;
  }
};

let deleteDriverSchedule = async (id) => {
  try {
    const schedule = await db.DriverSchedule.findByPk(id);
    if (!schedule)
      return { errCode: 2, errMessage: "Driver schedule not found" };

    await db.DriverSchedule.destroy({ where: { id } });
    return { errCode: 0, errMessage: "Driver schedule deleted successfully" };
  } catch (e) {
    throw e;
  }
};

export default {
  getAllDrivers,
  getAllDriverSchedules,
  getDriverScheduleById,
  createDriverSchedule,
  updateDriverSchedule,
  deleteDriverSchedule,
  getDriverSchedulesByUser,
};
