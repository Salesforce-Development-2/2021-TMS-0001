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
const adminRoute = require("./src/controllers/routes/adminRoute");
const assessmentRoute = require("./src/controllers/routes/assessmentRoute");
const courseRoute = require("./src/controllers/routes/courseRoute");
const trackRoute = require("./src/controllers/routes/trackRoute");
const traineeRoute = require("./src/controllers/routes/traineeRoute");

// IMPORTING THE ROUTES
const userRoute = require("./src/controllers/routes/userRoute");
const adminRoute = require("./src/controllers/routes/adminRoute");
const assessmentRoute = require("./src/controllers/routes/assessmentRoute");
const courseRoute = require("./src/controllers/routes/courseRoute");
const trackRoute = require("./src/controllers/routes/trackRoute");
const traineeRoute = require("./src/controllers/routes/traineeRouteRoute");

// Initialize app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// USING THE ROUTES
app.use("/", userRoute);
app.use("/", adminRoute);
app.use("/", assessmentRoute);
app.use("/", courseRoute);
app.use("/", trackRoute);
app.use("/", traineeRoute);

// HOME ROUTE
app.get("/", function (req, res) {
  res.send("<h2> Home Page Route </h2>");
});

// STARTING THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
