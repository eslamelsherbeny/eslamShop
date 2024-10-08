const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");

const factory = require("./handlersFactory");
const { uploadMixofImages } = require("../middleWares/uploadMiddleware");

exports.uploadProductImage = uploadMixofImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }

  next();
});

// create Product
exports.createProduct = factory.createOne(ProductModel);

// get all Product
exports.getAllProduct = factory.getAll(ProductModel, "Products");

// get specific Product

exports.getProduct = factory.getOne(ProductModel, "reviews");

// update Product

exports.updateProduct = factory.updateOne(ProductModel);

// delete Product
exports.deleteProduct = factory.deleteOne(ProductModel);
