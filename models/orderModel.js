// orderSchema
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: Number,
        color: String,
      },
    ],

    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,

      default: 0.0,
    },
    totalOrderPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentMethodType: {
      type: String,
      enum: ["Card", "Cach"],
      default: "Cach",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
      country: String,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone",
  }).populate({
    path: "cartItems.product",
    select: "title price ",
  });
  next();
});
module.exports = mongoose.model("Order", orderSchema);
