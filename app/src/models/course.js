// Import mongoose middleware
const mongoose = require("mongoose");

// Definition of course model through schema interface
const courseSchema = mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },

  course_master: {
      type: String,
      required: true,
  },
  users: [
    {
     enrollment_date: Date,
     user_id:{
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
     }
    },
  ],
  course_duration: Number,
  date_created: Date,
  date_updated: Date,
});

module.exports = mongoose.model("Course", courseSchema);
