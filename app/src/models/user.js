const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: String,
  password: String,
  email: {
    type: String
  },
  date_created: Date,
  date_updated: Date,
  role: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Role",
    required: true,
  },
})

module.exports = mongoose.model("User", userSchema);

