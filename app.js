const express = require("express");

const morgan = require("morgan");
const joi = require("joi");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");
const passportJwt = require("passport-jwt");

// import routes
const adminRoutes = require("./src/controllers/commons/admin/commons");
const userRoutes = require("./src/controllers/commons/user/commons");
const routes = require("./src/controllers/routes/routes");
const router = require("./src/controllers/commons/admin/commons");

// Initialize app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);


// Home Page route
app.get("/", function (req, res) {
  res.send("<h2> Home Page Route </h2>");
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
