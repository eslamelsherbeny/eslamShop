// cart Model
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
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
        default: 1,
      },
      price: Number,
      color: String,
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  totalCartPrice: Number,

  totalPriceAfterDiscount: Number,
});

module.exports = mongoose.model("Cart", cartSchema);
