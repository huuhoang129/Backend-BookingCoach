import db from "../../models/index.js";

let getAllBanners = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let banners = await db.Banners.findAll();
      if (banners && banners.length > 0) {
        banners.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data: banners,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getBannerById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        // if (!data.email) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Banners.findOne({
          where: {
            id: inputId,
          },
          attributes: ["title", "image"],
          raw: true,
        });

        if (data && data.image) {
          data.image = Buffer.from(data.image).toString("binary");
        }
        resolve({
          errMessage: "OK",
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createBanner = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.title || !data.imageBase64) {
        console.log("📥 Data nhận từ frontend:", data); // thêm log
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Banners.create({
          title: data.title,
          image: data.imageBase64,
        });

        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteBanner = (bannerId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.Banners.findOne({
      where: { id: bannerId },
    });
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: `Banner Isn't Exist`,
      });
    }
    await db.Banners.destroy({
      where: { id: bannerId },
    });

    resolve({
      errCode: 0,
      errMessage: `Banner Is Deleted`,
    });
  });
};

let updateBanner = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.title) {
        return resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      }

      let banner = await db.Banners.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (banner) {
        banner.title = data.title;
        if (data.imageBase64) {
          banner.image = data.imageBase64;
        }
        await banner.save();

        resolve({
          errCode: 0,
          errMessage: "Update Banner Succeeds!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `Banner's not found!`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  deleteBanner,
  updateBanner,
};
