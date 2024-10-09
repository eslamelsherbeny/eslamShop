const path = require("path");

const cors = require("cors");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");

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
  express.raw({ type: "application/json" }), // Stripe needs raw JSON body
  webhookCheckout
);

// middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode is ${process.env.NODE_ENV}`);
}

// mount routes

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
