const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleWares/uploadMiddleware");

// create category
exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.image = filename;
  }
  next();
});

exports.createUser = factory.createOne(UserModel);

// get all User
exports.getAllUser = factory.getAll(UserModel);

// get specific User

exports.getUser = factory.getOne(UserModel);

// update User

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,

    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      new ApiError(`no document found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,

    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      new ApiError(`no document found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

exports.deleteUser = factory.deleteOne(UserModel);

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.user._id,

    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken(document._id);
  res.status(200).json({ data: document, token });
});

exports.updateLogedUserData = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: document });
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({
    status: "success",
  });
});
