const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
    firstname: {
        type: String,
        required: true
    },
    username: String,
    lastname: String,
    password: String,
    email: String,
    date_created: Date,
    date_updated: Date,
    role_type: {type: mongoose.Schema.Types.ObjectID, ref: 'Role', required: true},
})

module.exports = mongoose.model("User", userSchema);