import db from "../../models/index.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let getAllEmployees = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let employees = await db.User.findAll({
        where: { role: ["Staff", "Driver"] },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.StaffDetail,
            as: "staffDetail",
            attributes: ["address", "dateOfBirth", "citizenId"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: employees,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getEmployeeById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let employee = await db.User.findOne({
          where: { id: inputId, role: ["Staff", "Driver"] },
          attributes: { exclude: ["password"] },
          include: [
            {
              model: db.StaffDetail,
              as: "staffDetail",
              attributes: ["address", "dateOfBirth", "citizenId"],
            },
          ],
          raw: true,
          nest: true,
        });

        if (!employee) {
          resolve({
            errCode: 2,
            errMessage: "Employee not found",
          });
        } else {
          resolve({
            errCode: 0,
            errMessage: "OK",
            data: employee,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

function generateEmployeeCode(role, id) {
  if (role === "Staff") return `STF${String(id).padStart(4, "0")}`;
  if (role === "Driver") return `DRV${String(id).padStart(4, "0")}`;
  return `EMP${String(id).padStart(4, "0")}`;
}

let createEmployee = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.firstName || !data.lastName || !data.role) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else if (!["Staff", "Driver"].includes(data.role)) {
        resolve({
          errCode: 3,
          errMessage: "Invalid role! Must be Staff or Driver",
        });
      } else {
        let employee = await db.User.findOne({ where: { email: data.email } });
        if (employee) {
          resolve({
            errCode: 2,
            errMessage: "Email already in use!",
          });
        } else {
          // 👇 password mặc định
          let defaultPassword = "123456";
          let hashedPassword = await hashUserPassword(defaultPassword);

          // 1. Tạo user trước
          let newUser = await db.User.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber || null,
            role: data.role,
            status: "Active",
          });

          // 2. Sinh mã nhân viên từ role + id
          let employeeCode = generateEmployeeCode(data.role, newUser.id);
          newUser.userCode = employeeCode;
          await newUser.save();

          // 3. Thêm staff detail nếu có
          if (data.address || data.dateOfBirth || data.citizenId) {
            await db.StaffDetail.create({
              userId: newUser.id,
              address: data.address || null,
              dateOfBirth: data.dateOfBirth || null,
              citizenId: data.citizenId || null,
            });
          }

          resolve({
            errCode: 0,
            errMessage: "Create Employee Success!",
            defaultPassword,
            employeeCode, // 👉 trả về mã nhân viên
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateEmployee = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter: id",
        });
      }

      // 1. Tìm user
      let employee = await db.User.findOne({
        where: { id: data.id, role: ["Staff", "Driver"] },
        raw: false,
      });

      if (!employee) {
        return resolve({
          errCode: 2,
          errMessage: "Employee not found!",
        });
      }

      // 2. Update thông tin trong bảng Users
      employee.firstName = data.firstName || employee.firstName;
      employee.lastName = data.lastName || employee.lastName;
      employee.phoneNumber = data.phoneNumber || employee.phoneNumber;
      employee.email = data.email || employee.email;
      if (data.role && ["Staff", "Driver"].includes(data.role)) {
        employee.role = data.role;
      }

      await employee.save();

      // 3. Update bảng StaffDetail
      let staffDetail = await db.StaffDetail.findOne({
        where: { userId: employee.id },
        raw: false,
      });

      if (staffDetail) {
        staffDetail.address = data.address || staffDetail.address;
        staffDetail.dateOfBirth = data.dateOfBirth || staffDetail.dateOfBirth;
        staffDetail.citizenId = data.citizenId || staffDetail.citizenId;
        await staffDetail.save();
      } else if (data.address || data.dateOfBirth || data.citizenId) {
        await db.StaffDetail.create({
          userId: employee.id,
          address: data.address || null,
          dateOfBirth: data.dateOfBirth || null,
          citizenId: data.citizenId || null,
        });
      }

      return resolve({
        errCode: 0,
        errMessage: "Update Employee Success!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteEmployee = (employeeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundEmployee = await db.User.findOne({
        where: { id: employeeId, role: ["Staff", "Driver"] },
      });

      if (!foundEmployee) {
        return resolve({
          errCode: 2,
          errMessage: "Employee not found!",
        });
      }

      // Xóa staff_details trước (nếu có)
      await db.StaffDetail.destroy({
        where: { userId: employeeId },
      });

      // Sau đó xóa user
      await db.User.destroy({
        where: { id: employeeId },
      });

      return resolve({
        errCode: 0,
        errMessage: "Employee deleted successfully!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
