const mongoose = require('mongoose');

const trackSchema = mongoose.Schema ({
    track_name: {
        type: String,
        required: true
    },
    track_master: String,
    date_created: Date,
    course_id: [{
        type: mongoose.Schema.Types.ObjectID, 
        ref: 'Course'}
        
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