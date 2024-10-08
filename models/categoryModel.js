const mongose = require("mongoose");

const CategorySchema = new mongose.Schema(
  {
    name: {
      type: String,
      required: [true, " category is required"],
      unique: [true, "category should be unique"],
      minlength: [3, "too short category name"],
      maxlength: [32, "too long category name"],
    },
    image: String,
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// mongose middleware

const setUrlImage = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BaseUrl}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", (doc) => {
  setUrlImage(doc);
});

CategorySchema.post("save", (doc) => {
  setUrlImage(doc);
});

module.exports = mongose.model("Category", CategorySchema);
