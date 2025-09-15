import employeeServices from "../../services/userManageServices/employeeServices.js";

let getAllEmployees = async (req, res) => {
  try {
    let employees = await employeeServices.getAllEmployees();
    return res.status(200).json(employees);
  } catch (e) {
    console.log("Get All Employees Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getEmployeeById = async (req, res) => {
  try {
    let employee = await employeeServices.getEmployeeById(req.query.id);
    return res.status(200).json(employee);
  } catch (e) {
    console.log("Get Employee By ID Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let createEmployee = async (req, res) => {
  try {
    let data = req.body;
    let message = await employeeServices.createEmployee(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Create Employee Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let updateEmployee = async (req, res) => {
  try {
    let data = req.body;
    let message = await employeeServices.updateEmployee(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Update Employee Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteEmployee = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    }
    let message = await employeeServices.deleteEmployee(req.body.id);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Delete Employee Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
