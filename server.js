const path = require("path");

const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");

const xss = require("xss-clean");

dotenv.config();
const dbConnection = require("./confiq/dataBase");
const ApiError = require("./utils/apiError");
const globalError = require("./middleWares/errorMiddleware");
const mountRoutes = require("./routes/index");

const { webhookCheckout } = require("./services/orderServices");

// connect to database

dbConnection();

// express app
const app = express();
app.use(cors());
app.use(compression());
app.options("*", cors());

// webhook

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// middleware
app.use(express.json({ limit: "20kb" }));

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode is ${process.env.NODE_ENV}`);
}

app.use(mongoSanitize());

app.use(xss());
// mount routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,

  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api", limiter);

app.use(
  hpp({
    whitelist: [
      "ratingQuantity",
      "ratingAverage",
      "quantity",
      "maxGroupSize",
      "sold",
      "price",
    ],
  })
);

mountRoutes(app);

// global error

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.all("*", (req, res, next) => {
  next(
    new ApiError(`Cant find this route ${req.originalUrl} on this server`, 400)
  );
});

app.use(globalError);

// server listen
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Error: ${err.name} || ${err.message}`);
  console.error(err.name, err.message);
  server.close(() => {
    console.log("server is shutting down ...");
    process.exit(1);
  });
});
