const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const BrandModel = require("../models/brandModel ");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleWares/uploadMiddleware");

// create category
exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

exports.createBrand = factory.createOne(BrandModel);

// get all Brand
exports.getAllBrand = factory.getAll(BrandModel);

// get specific Brand

exports.getBrand = factory.getOne(BrandModel);

// update Brand

exports.updateBrand = factory.updateOne(BrandModel);

// delete Brand
exports.deleteBrand = factory.deleteOne(BrandModel);
