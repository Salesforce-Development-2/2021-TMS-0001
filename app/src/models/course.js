const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  coursename: {
    type: String,
    required: true,
  },

  coursemaster: {
    name: {
      type: String,
      required: true,
    },
  },
  user_id: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
  ],
  courseduration: Number,
  date_created: Date,
  date_updated: Date,
});

module.exports = mongoose.model("Course", courseSchema);
