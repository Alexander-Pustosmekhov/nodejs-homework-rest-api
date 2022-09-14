const multer = require("multer");
const path = require("path");
const uuid = require("uuid");

const FILE_PATH = path.resolve("./tmp");
const storage = multer.diskStorage({
  destination: FILE_PATH,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    return cb(null, uuid.v4() + ext);
  },
});

const uploadMiddlewar = multer({ storage });

module.exports = { uploadMiddlewar };
