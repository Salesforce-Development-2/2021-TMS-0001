// CORE MODULES
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// INTERNAL MODULES - FILES - OUR OWN MODULES
const config = require("../../config/config");
const Role = require("../../models/role");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

// ROUTES
// Login - POST
router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({
    email: email,
  })
    .then((user) => {
      if (!user) {
        //   If user not found
        return res.status(401).json({
          code: "user-not-found",
          message: "The email specified is not found!",
        });
      }
      // If user exist - validate the user
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(async (isEqual) => {
      if (!isEqual) {
        // Wrong password - If password entered by the user is incorrect
        return res.status(401).json({
          code: "Unauthorized",
          message: "Wrong Credentials",
        });
      }
      // Generatw jwt token - If credentials are correct
      const token = jwt.sign(
        {
          email: loadedUser.email,
          user_id: loadedUser._id.toString(),
        },
        // secrete key (secretKey) from config/config.js
        config.secretKey
        // token expires in 2h (2 hours)
        // { expiresIn: "24h" }
      );
      const role = await Role.findById(loadedUser.role).select("-actions");
      res.status(200).json({
        token: token,
        user_id: loadedUser._id.toString(),
        role: role,
      });
    })
    //   If error - Internal server error
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

//login
router.get("/login", async function (req, res) {
  res.render('login')
})

//upload files
router.get("/upload", async function (req, res) {
  res.render('upload')
})
router.post("/upload", async function (req, res) {
  const fileUploaded = (req.file)
  if(!fileUploaded){
    return res.status(400).json({
      code: "Bad request",
      message: "Upload fail",
    });
  }else{
    return res.status(201).json({
      code: "Created",
      message: "File uploaded successfully",
    });
  }
})
// EXPORTS
module.exports = router;
