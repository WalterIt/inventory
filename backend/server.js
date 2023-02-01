const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 5000;

// ERROR MIDDLEWARE
app.use(errorHandler);

//Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}!`);
    });
  })
  .catch((error) => console.log(error));

// ROUTES
app.get("/", (req, res) => {
  res.send("HOME PAGE");
});

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES MIDDLEWARE
app.use("/api/users", userRoute);
