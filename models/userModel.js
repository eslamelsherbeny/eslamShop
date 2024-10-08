const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// user model
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      unique: true,
    },
    phone: String,

    profileImg: String,

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },

    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        alias: String,
        details: String,
        city: String,
        postalCode: String,
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
