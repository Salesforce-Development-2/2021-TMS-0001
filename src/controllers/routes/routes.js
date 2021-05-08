var express = require("express");
var router = express.Router();

// About page route.
router.get("/about", function (req, res) {
  // The Logic goes here
  res.send("<h2>The logic goes here</h2>");
});

module.exports = router;
