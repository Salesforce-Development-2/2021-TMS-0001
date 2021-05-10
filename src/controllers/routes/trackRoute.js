const express = require("express");
const trackRoute = express.Router();


// TRACK ROUTE
trackRoute.get("/", function (req, res) {
  // The Logic goes here
  res.send("<h2>The logic goes here</h2>");
});

module.exports = trackRoute;
