const express = require("express");
const morgan = require("morgan");
const joi = require("joi");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import models
const User = require("./app/src/models/user");
const Role = require("./app/src/models/role");

// import swagger
const swaggerUI = require('swagger-ui-express');


// import routes - Our own files
const adminRoutes = require("./app/src/controllers/admin/admin");
const userRoutes = require("./app/src/controllers/user/user");
const commonsRoutes = require("./app/src/controllers/commons/commons");
// auth.js file - this file contain authentication scripts
const authRoute = require("./app/src/controllers/auth/auth");

// import configuration
const config = require("./app/src/config/config");
mongoose.connect(
  config.mongoUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) console.log("Connected to db!");
    if (config.createSuperUser) {
      const User = require('./app/src/models/user');
      Role.findOne({role_type: config.admin.role_type})
      .then(role =>{
        const admin = new User({
          email: config.admin.email,
          password: bcrypt.hashSync(config.admin.password, 10),
          firstname: config.admin.firstname,
          lastname: config.admin.lastname,
          role_type: role._id
        })
        admin.save();
      });
    
    }
  }
);

// Initialize app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const swaggerDocument = require('./api-docs.json')

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


// Register a middleware to protect all the routes except the auth route
app.use(async function (req, res, next) {

  // If request comes to /admin or /users 
  if (req.url.startsWith('/admin') || req.url.startsWith('/users')) {
    // Authenticate
    // Extract the bearer token
    const authString = req.headers['authorization'];
    // If no token found return 401
    if (!authString) {
      res.status(401).json({
        code: 'jwt-notfound',
        message: "Jwt not found!"
      })
      return;
    }

    // Else split 'Bearer' and <token>
    const parts = authString.split(" ");

    // Get the <token> part
    const token = parts[1];
    // Verify the token with the secret key
    jwt.verify(token, config.secretKey, async function (err, payload) {

      // If unable to verify return unauthorized
      if (err) {
        res.status(401).json({
          code: 'authentication-failed',
          message: 'An error occured',
          error: err
        })
      }

      // If it passes verification check if the route the request is coming to is the admin route
      else {
        if (req.url.startsWith("/admin")) {

          // Extract the user_id from the payload
          const { user_id } = payload;

          // Use the id to find the user
          const user = await User.findById(user_id);

          // Find the role of the user
          const role = await Role.findById(user.role_type);

          // If the user is an admin allow access
          if (role.role_type == "admin") next();

          // If the user is not admin return 401
          else res.status(401).json({
            code: "unathorized",
            message: "User is not admin"
          })
        }

        // If the route the request is trying to access is not admin or user allow access
        else {
          next();
        }


      }
    })

  } 

  else {
      next();
      return;
  }



});

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// Login auth route - GET - "/auth/login"
app.use("/auth", authRoute);

app.use(commonsRoutes);

// STARTING THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



