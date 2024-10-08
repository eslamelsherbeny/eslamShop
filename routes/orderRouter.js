const express = require("express");

const {
  creatCasheOrder,
  filterOrderForUser,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  createCheckoutSession,
} = require("../services/orderServices");

const authService = require("../services/authServices");

const router = express.Router();

router.use(authService.protect);

router.get(
  "/checkoutSession/:cartId",
  authService.allowedTo("user"),
  createCheckoutSession
);

router.route("/:cartId").post(authService.allowedTo("user"), creatCasheOrder);

router
  .route("/")
  .get(
    authService.allowedTo("admin", "manager", "user"),
    filterOrderForUser,
    getAllOrders
  );
router.route("/:id").get(getSpecificOrder);
router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
