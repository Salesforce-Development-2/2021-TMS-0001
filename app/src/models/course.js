const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  coursename: {
    type: String,
    required: true,
  },

  coursemaster: {
    name: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      required: true,
    },
  },
  courseduration: String,
  date_created: Date,
  date_updated: Date,
});

module.exports = mongoose.model("Course", courseSchema);
