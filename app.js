const express = require("express");
const morgan = require("morgan");
const joi = require("joi");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");
const passportJwt = require("passport-jwt");

// import routes - Our own files
const adminRoutes = require("./app/src/controllers/admin/admin");
const userRoutes = require("./app/src/controllers/user/user");
const commonsRoutes = require("./app/src/controllers/commons/commons");
// auth.js file - this file contain authentication scripts
const auth = require("./app/src/controllers/auth");

mongoose.connect(
  "mongodb://localhost:27017/transcript",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) console.log("Connected to db!");
  }
);

// Initialize app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register a middleware to protect all the routes except the auth route
app.use(function(req, res, next){

  // If a client request comes to the auth route allow access
  if(req.url.startsWith('/auth')){
      next();
      return;
  }

  // Else Authenticate
  // Extract the bearer token
  const authString = req.headers['authorization'];

  // If no token found return 401
  if(!authString){
      res.status(401).json({
          code: 'jwt-notfound',
          message: "Jwt not found!"
      })
      return ;
  }

  // Else split 'Bearer' and <token>
  const parts = authString.split(" ");

  // Get the <token> part
  const token = parts[1];

  // Verify the token with the secret key
  jwt.verify(token, config.secretKey, async function(err, payload){

    // If unable to verify return unauthorized
      if(err){
          res.status(401).json({
              code: 'authentication-failed',
              message: 'An error occured',
              error: err
          })
      } 

      // If it passes verification check if the route the request is coming to is the admin route
      else{
        if(req.url.startsWith("/admin")){

          // Extract the user_id from the payload
          const {_id} = payload;

          // Use the id to find the user
          const user = await User.findById(_id);

          // Find the role of the user
          const role = await Role.findById(user.role_type);

          // If the user is an admin allow access
          if(role.role_type == "admin") next();

          // If the user is not admin return 401
          else res.status(401).json({
            code: "unathorized",
            message: "User is not admin"
          })
        } 
        
        // If the route the request is trying to access is not admin allow access
        else {
          next();
        }

        
      } 
  })
});

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.use(commonsRoutes);

// STARTING THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
