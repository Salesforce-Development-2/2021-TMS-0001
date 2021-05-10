const express = require("express");
const courseRoute = express.Router();

// COURSE ROUTE
courseRoute.get("/", function (req, res) {
  // The Logic goes here
  res.send("<h2>The logic goes here</h2>");
});

module.exports = courseRoute;
