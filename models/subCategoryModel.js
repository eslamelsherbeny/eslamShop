const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " sub category is required"],
      unique: [true, "sub category should be unique"],
      minlength: [2, "too short sub category name"],
      maxlength: [32, "too long sub category name"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "category id is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
