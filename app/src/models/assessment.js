// Import mongoose middleware
const mongoose = require('mongoose');

// Definition of assessment model through schema interface
const assessmentSchema = mongoose.Schema ({
    assessment_type: String,
    score: Number,
    assessment_date: Date,
    course_id: {
        type:  mongoose.Schema.Types.ObjectID,
        ref: 'Course',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User",
    }

})

module.exports = mongoose.model("Assessment", assessmentSchema);