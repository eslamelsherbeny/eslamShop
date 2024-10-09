const crypto = require("crypto");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

const sendEmail = require("../utils/sendEmail");

// signUp service
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);

  res.status(201).json({
    data: user,
    token,
  });
});

// login service
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("invalid email or password", 400));
  }

  const token = createToken(user._id);

  res.status(200).json({
    data: user,
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(new ApiError("you are not logged in,please login again", 401));
  }

  const decoded = jwt.verify(token, `${process.env.JWT_SECRET_Key}`);

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError("the user belonging to this token no longer exist", 401)
    );
  }
  if (currentUser.passwordChangedAt) {
    const changedPasswordTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (changedPasswordTimeStamp > decoded.iat) {
      return next(
        new ApiError("user recently changed password , please login again", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to perform this action", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("user not found", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetVerified = false;
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  const message = `Hi ${user.name}, \n
we received a request to reset your password on your E=Shop account. \n
If this was you, please enter the following code to reset your password: \n
${resetCode} \n
If you did not request a password reset, please ignore this email. \n

Thank you for using E-Shop.\n
E-Shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "password reset code(valid for 10 min)",
      message: message,
    });
  } catch (error) {
    user.passwordResetVerified = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new ApiError("email could not be sent", 500));
  }

  await user.save();
  res.status(200).json({
    status: "success",
    message: "check your email for reset code",
  });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("invalid reset code", 400));
  }
  user.passwordResetVerified = true;

  await user.save();
  res.status(200).json({
    status: "success",
    message: "password reset code verified",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("user not found", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("invalid reset code", 400));
  }

  user.password = req.body.password;

  user.passwordChangedAt = Date.now();
  user.passwordResetVerified = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    message: "password reset success",
    token,
  });
});
