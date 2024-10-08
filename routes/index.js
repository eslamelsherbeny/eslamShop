const categoryRouter = require("./categoryRouter");
const brandRouter = require("./brandRouter ");
const broductRouter = require("./productRouter ");
const subCategoryRouter = require("./subCategoryRouter ");
const userRouter = require("./userRouter ");
const authRouter = require("./authRouter");
const reviewRouter = require("./reviewRouter");
const wishlistRouter = require("./wishlistRouter");
const addressRouter = require("./addressRouter ");
const couponRouter = require("./couponRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", broductRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);
};

module.exports = mountRoutes;
