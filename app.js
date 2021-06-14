const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const favicon = require("serve-favicon");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const https = require("https");
const path = require("path");
const multer = require("multer")

// import models
const User = require("./app/src/models/user");
const Role = require("./app/src/models/role");

// import homepage html
const homepage = require("./app/src/utils/ui");
// import swagger
const swaggerUI = require("swagger-ui-express");

// import routes - Our own files
const usersRoute = require("./app/src/controllers/users");
const assessmentsRoute = require("./app/src/controllers/assessments");
const tracksRoute = require("./app/src/controllers/tracks");
const coursesRoute = require("./app/src/controllers/courses");
const batchesRoute = require("./app/src/controllers/batch");

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
      const User = require("./app/src/models/user");
      Role.findOne({ role_type: config.admin.role_type }).then((role) => {
        const admin = new User({
          email: config.admin.email,
          password: bcrypt.hashSync(config.admin.password, 10),
          firstname: config.admin.firstname,
          lastname: config.admin.lastname,
          role_type: role._id,
        });
        admin.save();
      });
    }
  }
);

// setup multer file storage
const fileStorage = multer.diskStorage({
  destination: (req, res, cb)=>{
          cb(null, './app/uploads')
  },
  filename: (req, file, cb)=>{
          cb(null, new Date().toISOString().replace(/:/g, '-')  + file.originalname)
  }
})

const fileFilter = (req,file,cb)=>{
  if (file.mimetype ==='image/png'){
          cb(null, true)
  }else{
          cb(null, false)
  }

}


// Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Setup rendering template
app.set("view engine", "ejs");
app.use(helmet());
app.use(morgan('tiny'));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('file'));

const swaggerDocument = require("./api-docs.json");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send(homepage);
});

// Register a middleware to protect all the routes except the auth route
app.use(async function (req, res, next) {
  // If request comes to /auth or /api-docs do not authenticate
  if (req.url.startsWith("/auth") || req.url.startsWith("/api-docs")) next();
  else {
    // Authenticate
    // Extract the bearer token
    const authString = req.headers["authorization"];

    // If no token found return 401
    if (!authString) {
      res.status(401).json({
        code: "jwt-notfound",
        message: "Jwt not found!",
      });
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
          code: "authentication-failed",
          message: "An error occured",
          error: err,
        });
      }

      // If it passes verification check if the route the request is coming to is the admin route
      else {
        // Extract the user_id from the payload
        const { user_id } = payload;
        // Use the id to find the user
        const user = await User.findById(user_id).populate("role");
        req.user = user;

        next();
      }
    });
  }
});

// Added middleware for Users, Tracks, Batches, Courses and Assessment Routes
app.use("/users", usersRoute);
app.use("/tracks", tracksRoute);
app.use("/batches", batchesRoute);
app.use("/courses", coursesRoute);
app.use("/assessments", assessmentsRoute);

// Rendering static files
app.use(express.static(path.join(__dirname, "public")));


// Render the home page using ejs
app.get("/home", (req, res) => {
  res.render("home", {
    pageTitle: "Home",
    path: "/home",
  });
});

// Login auth route - GET - "/auth/login"
app.use("/auth", authRoute);

// STARTING THE SERVER
const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
