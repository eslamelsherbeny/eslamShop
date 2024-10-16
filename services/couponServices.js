const CouponModel = require("../models/couponModel");

const factory = require("./handlersFactory");

exports.createCoupon = factory.createOne(CouponModel);

exports.getAllCoupon = factory.getAll(CouponModel);

exports.getCoupon = factory.getOne(CouponModel);

exports.updateCoupon = factory.updateOne(CouponModel);

exports.deleteCoupon = factory.deleteOne(CouponModel);
