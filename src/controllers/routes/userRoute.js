var express = require("express");
var router = express.Router();

// USER ROUTE
router.get("/", function (req, res) {
  // The Logic goes here
  res.send("<h2>The logic goes here</h2>");
});

module.exports = router;
