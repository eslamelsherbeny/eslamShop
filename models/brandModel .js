const mongose = require("mongoose");

const BrandSchema = new mongose.Schema(
  {
    name: {
      type: String,
      required: [true, " Brand is required"],
      unique: [true, "Brand should be unique"],
      minlength: [3, "too short Brand name"],
      maxlength: [32, "too long Brand name"],
    },
    image: String,
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const setUrlImage = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BaseUrl}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", (doc) => {
  setUrlImage(doc);
});

BrandSchema.post("save", (doc) => {
  setUrlImage(doc);
});

module.exports = mongose.model("Brand", BrandSchema);
