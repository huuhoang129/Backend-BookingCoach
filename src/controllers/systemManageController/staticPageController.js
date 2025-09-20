import staticPageServices from "../../services/systemManageServices/staticPageServices";

let getAboutPage = async (req, res) => {
  try {
    let data = await staticPageServices.getAboutPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getAboutPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// let createAboutPage = async (req, res) => {
//   try {
//     let blocks = req.body.blocks;
//     let data = await staticPageServices.createAboutPage(blocks);
//     return res.status(200).json(data);
//   } catch (e) {
//     console.error("Error in createAboutPage:", e);
//     return res.status(500).json({
//       errCode: -1,
//       errMessage: "Error from server",
//     });
//   }
// };

let updateAboutPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updateAboutPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updateAboutPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getConditionsPage = async (req, res) => {
  try {
    let data = await staticPageServices.getConditionsPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getConditionsPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateConditionsPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updateConditionsPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updateConditionsPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getPrivacyPolicyPage = async (req, res) => {
  try {
    let data = await staticPageServices.getPrivacyPolicyPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getPrivacyPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updatePrivacyPolicyPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updatePrivacyPolicyPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updatePrivacyPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getRefundPolicyPage = async (req, res) => {
  try {
    let data = await staticPageServices.getRefundPolicyPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getRefundPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateRefundPolicyPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updateRefundPolicyPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updateRefundPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getPaymentPolicyPage = async (req, res) => {
  try {
    let data = await staticPageServices.getPaymentPolicyPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getPaymentPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updatePaymentPolicyPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updatePaymentPolicyPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updatePaymentPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getCancellationPolicyPage = async (req, res) => {
  try {
    let data = await staticPageServices.getCancellationPolicyPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getCancellationPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateCancellationPolicyPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updateCancellationPolicyPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updateCancellationPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getShippingPolicyPage = async (req, res) => {
  try {
    let data = await staticPageServices.getShippingPolicyPage();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in getShippingPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let updateShippingPolicyPage = async (req, res) => {
  try {
    let blocks = req.body.blocks;
    let data = await staticPageServices.updateShippingPolicyPage(blocks);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in updateShippingPolicyPage:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getAboutPage,
  // createAboutPage,
  updateAboutPage,
  getConditionsPage,
  updateConditionsPage,
  getPrivacyPolicyPage,
  updatePrivacyPolicyPage,
  getRefundPolicyPage,
  updateRefundPolicyPage,
  getPaymentPolicyPage,
  updatePaymentPolicyPage,
  getCancellationPolicyPage,
  updateCancellationPolicyPage,
  getShippingPolicyPage,
  updateShippingPolicyPage,
};
