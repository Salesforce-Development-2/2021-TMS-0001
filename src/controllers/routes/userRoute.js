const express = require("express");
const userRoute = express.Router();

// USER ROUTE
userRoute.get("/", function (req, res) {
  // The Logic goes here
  res.send("<h2>The logic goes here</h2>");
});

module.exports = userRoute;
