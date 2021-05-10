const express = require("express");
const assessmentRoute = express.Router();


// ASSESSMENT ROUTE
router.get("/", function (req, res) {
  // The Logic goes here
  res.send("<h2>The logic goes here</h2>");
});

module.exports = assessmentRoute;
