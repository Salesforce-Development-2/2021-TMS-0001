// Import mongoose middleware
const mongoose = require('mongoose');

// Definition of track model through schema interface
const trackSchema = mongoose.Schema ({
    track_name: {
        type: String,
        required: true
    },
    track_master: String,
    date_created: Date,
    courses: [{
        enrollment_date: Date,
        course_id:{
            type: mongoose.Schema.Types.ObjectID, 
            ref: 'Course'}
        }
    ],
    users: [
        {
         enrollment_date: Date,
         user_id:{
          type: mongoose.Schema.Types.ObjectID,
          ref: "User",
         }
        },
    ],
})

module.exports = mongoose.model("Track", trackSchema);