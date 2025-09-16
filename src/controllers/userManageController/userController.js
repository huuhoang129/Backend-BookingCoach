import userServices from "../../services/userManageServices/userServices.js";

let getAllUsers = async (req, res) => {
  try {
    let users = await userServices.getAllUsers();
    return res.status(200).json(users);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getUserById = async (req, res) => {
  try {
    let user = await userServices.getUserById(req.query.id);
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createUser = async (req, res) => {
  try {
    let message = await userServices.createUser(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.error("❌ Error in handleCreateUser:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

let editUser = async (req, res) => {
  try {
    let data = req.body;
    let message = await userServices.updateUser(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteUser = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter!",
      });
    }
    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
};
