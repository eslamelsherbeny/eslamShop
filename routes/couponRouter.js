const express = require("express");

const {
  createCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServices");

const authService = require("../services/authServices");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.route("/").post(createCoupon).get(getAllCoupon);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
