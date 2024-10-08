const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOption = () => {
  const multerStorage = multer.memoryStorage();

  const multerFile = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only upload image is allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFile });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOption().single(fieldName);

exports.uploadMixofImages = (arrayofFields) =>
  multerOption().fields(arrayofFields);
