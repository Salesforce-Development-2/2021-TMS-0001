const mongoose = require('mongoose');

const assessmentSchema = mongoose.Schema ({
    assessment_type: String,
    score: Number,
    course_id: {
        type:  mongoose.Schema.Types.ObjectID,
        ref: 'Course',
        required: true
    }
})

module.exports = mongoose.model("Assessment", assessmentSchema);