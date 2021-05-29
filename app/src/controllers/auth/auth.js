// CORE MODULES
const express = require("express");
const router = express.Router;

// INTERNAL MODULES - FILES - OUR OWN MODULES
const config = require("../app/src/config/config");
const Role = require("../app/src/models/role");
const User = require("../app/src/models/user");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// ROUTES
// Login - POST
router.post("/auth/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({
    email: email,
  })
    .then((user) => {
      if (!user) {
        //   If user not found
        const error = new Error("A User with this email could not be found!");
        error.statusCode = 401;
        throw error;
      }
      // If user exist - validate the user
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        // Wrong password - If password entered by the user is incorrect
        const error = new Error("The password is incorrect!");
        error.statusCode = 401;
        throw error;
      }
      // Generatw jwt token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          user_id: loadedUser._id.toString(),
        },
        config.secretKey,
        { expiresIn: "2h" }
      );
      res.status(200).json({
        token: token,
        user_id: loadedUser._id.toString(),
      });
    })
    //   If error - Inerna server error
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

// EXPORTS
module.exports = router;
