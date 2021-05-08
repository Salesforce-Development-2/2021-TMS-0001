const express = require("express");
const app = express();
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
