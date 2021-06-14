// Import mongoose middleware
const mongoose = require('mongoose');

// Definition of role model through schema interface
const roleSchema = mongoose.Schema({
    role_title: String,
    actions:[
        {type: mongoose.Schema.Types.ObjectID, ref: 'Action'}
    ]
})

module.exports = mongoose.model('Role', roleSchema);