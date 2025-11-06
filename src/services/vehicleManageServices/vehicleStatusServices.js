import db from "../../models/index.js";

let getAllVehicleStatus = async () => {
  try {
    let data = await db.VehicleStatus.findAll({
      include: [{ model: db.Vehicle, as: "vehicle" }],
      order: [["updatedAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return { errCode: 0, errMessage: "OK", data };
  } catch (e) {
    console.error("❌ getAllVehicleStatus error:", e);
    throw e;
  }
};

let getStatusByVehicleId = async (vehicleId) => {
  try {
    if (!vehicleId) {
      return { errCode: 1, errMessage: "Missing parameter: vehicleId" };
    }

    const status = await db.VehicleStatus.findOne({
      where: { vehicleId },
      include: [{ model: db.Vehicle, as: "vehicle" }],
      raw: false,
      nest: true,
    });

    if (!status) return { errCode: 2, errMessage: "Vehicle status not found" };

    return { errCode: 0, errMessage: "OK", data: status };
  } catch (e) {
    console.error("❌ getStatusByVehicleId error:", e);
    throw e;
  }
};

let updateVehicleStatus = async (data) => {
  try {
    if (!data.vehicleId || !data.status) {
      return { errCode: 1, errMessage: "Missing required parameters" };
    }

    const existing = await db.VehicleStatus.findOne({
      where: { vehicleId: data.vehicleId },
      raw: false,
    });

    if (existing) {
      if (
        existing.status === data.status &&
        existing.note === (data.note || null)
      ) {
        return {
          errCode: 2,
          errMessage: "Vehicle status already up to date",
        };
      }

      await existing.update({
        status: data.status,
        note: data.note || null,
      });

      return {
        errCode: 0,
        errMessage: "Vehicle status updated successfully",
      };
    } else {
      await db.VehicleStatus.create({
        vehicleId: data.vehicleId,
        status: data.status,
        note: data.note || null,
      });

      return {
        errCode: 0,
        errMessage: "Vehicle status created successfully",
      };
    }
  } catch (e) {
    console.error("❌ updateVehicleStatus error:", e);
    throw e;
  }
};

let deleteVehicleStatus = async (id) => {
  const deleted = await db.VehicleStatus.destroy({ where: { id } });

  if (!deleted) return { errCode: 2, errMessage: "Vehicle status not found" };

  return { errCode: 0, errMessage: "Vehicle status deleted successfully" };
};

export default {
  getAllVehicleStatus,
  getStatusByVehicleId,
  updateVehicleStatus,
  deleteVehicleStatus,
};
