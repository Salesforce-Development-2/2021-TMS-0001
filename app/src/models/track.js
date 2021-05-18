const mongoose = require('mongoose');

const trackSchema = mongoose.Schema ({
    trackname: {
        type: String,
        required: true
    },
    trackmaster: String,
    date_created: Date,
    course_id: [{
        type: mongoose.Schema.Types.ObjectID, 
        ref: 'Course'}
        
    ],
    user_id: [{
        type: mongoose.Schema.Types.ObjectID, 
        ref: 'User'}
    ]
})

module.exports = mongoose.model("Track", trackSchema);