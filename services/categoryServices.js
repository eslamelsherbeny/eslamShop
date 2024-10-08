const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");

const sharp = require("sharp");

const factory = require("./handlersFactory");

const CategoryModel = require("../models/categoryModel");

const { uploadSingleImage } = require("../middleWares/uploadMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }

  next();
});

exports.createCategory = factory.createOne(CategoryModel);

// get all Category
exports.getAllCategory = factory.getAll(CategoryModel);

// get specific Category

exports.getCategory = factory.getOne(CategoryModel);

// update Category

exports.updateCategory = factory.updateOne(CategoryModel);

// delete Category
exports.deleteCategory = factory.deleteOne(CategoryModel);
