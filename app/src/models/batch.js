// Import mongoose middleware
const mongoose = require('mongoose');

// Definition of batch model through schema interface
const batchSchema = mongoose.Schema ({
    batch_name: {
        type: String,
        required: true
    },
    date_created: Date,
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

module.exports = mongoose.model("Batch", batchSchema);