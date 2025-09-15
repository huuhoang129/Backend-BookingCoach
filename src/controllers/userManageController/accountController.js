import accountServices from "../../services/userManageServices/accountServices.js";

// Lấy tất cả account
let getAllAccounts = async (req, res) => {
  try {
    let result = await accountServices.getAllAccounts();
    return res.status(200).json(result);
  } catch (e) {
    console.log("Get All Accounts Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

// Khóa account
let lockAccount = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    }

    let result = await accountServices.lockAccount(id);
    return res.status(200).json(result);
  } catch (e) {
    console.log("Lock Account Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

// Mở account
let unlockAccount = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    }

    let result = await accountServices.unlockAccount(id);
    return res.status(200).json(result);
  } catch (e) {
    console.log("Unlock Account Error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

export default {
  getAllAccounts,
  lockAccount,
  unlockAccount,
};
