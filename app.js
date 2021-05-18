const express = require('express')
const morgan = require("morgan");
const joi = require("joi");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");
const passportJwt = require("passport-jwt");

// import routes
const adminRoutes = require("./app/src/controllers/admin/admin");
const userRoutes = require("./app/src/controllers/user/user");


mongoose.connect('mongodb://localhost:27017/transcript', 
{
  useNewUrlParser: true, 
  useUnifiedTopology: true
},
(err)=>{ 
  if(!err) console.log('Connected to db!');
});


// Initialize app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);



// STARTING THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
