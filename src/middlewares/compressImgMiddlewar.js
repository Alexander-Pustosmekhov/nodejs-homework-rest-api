const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;

const AVATAR_URL = path.resolve("./public/avatars");

const compressImgMiddlewar = async (req, res, next) => {
  try {
    const draftPath = req.file.path;
    const file = await Jimp.read(draftPath);

    const newPath = path.join(AVATAR_URL, req.file.filename);

    await file.resize(250, 250).quality(60).writeAsync(newPath);

    req.file.path = newPath;
    req.file.destination = AVATAR_URL;

    await fs.unlink(draftPath);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { compressImgMiddlewar };
