const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const Order = require("../models/orderModel");

// crearOrder

exports.creatCasheOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const { shippingAddress } = req.body;

  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  if (cart.cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }
  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    totalOrderPrice,
    shippingAddress,
    cartItems: cart.cartItems,
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOption, {});
  }

  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

exports.filterOrderForUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };
  next();
});

exports.getAllOrders = factory.getAll(Order);

exports.getSpecificOrder = factory.getOne(Order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  if (order.isPaid) {
    return next(new ApiError("Order is already paid", 400));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  if (order.isDelivered) {
    return next(new ApiError("Order is already delivered", 400));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const { shippingAddress } = req.body;

  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  if (cart.cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }

  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: shippingAddress,

    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
  });

  res.status(200).json({ status: "success", data: session, url: session.url });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  let event;
  const signature = req.headers["stripe-signature"];
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      "whsec_YcpxrwtX383jwgYbX94XcQ4mrXTznGrk"
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("Payment successfull");
  }
});
