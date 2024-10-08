const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  changeMyPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator ");

const {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLogedUserData,
  deleteLoggedUserData,
} = require("../services/userServices ");
const authService = require("../services/authServices");

const router = express.Router();

// get logged in user data

router.get("/getme", authService.protect, getLoggedUserData, getUser);

router.put(
  "/changeMyPassword",
  authService.protect,
  changeMyPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/updateMyData",
  authService.protect,
  updateLoggedUserValidator,
  updateLogedUserData
);

router.delete("/deleteme", authService.protect, deleteLoggedUserData);

// only admin can access this route
router.use(authService.protect, authService.allowedTo("admin"));

router.put("/changePassword/:id", changePasswordValidator, changeUserPassword);

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(authService.protect, authService.allowedTo("admin"), getAllUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
