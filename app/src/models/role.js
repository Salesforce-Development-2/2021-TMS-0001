const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    role_title: String,
    actions:[
        {type: mongoose.Schema.Types.ObjectID, ref: 'Action'}
    ]
})

module.exports = mongoose.model('Role', roleSchema);