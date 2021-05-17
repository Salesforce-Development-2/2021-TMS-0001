const mongoose = require('mongoose');

const actionSchema = mongoose.Schema({
    action: String
})

module.exports = mongoose.model('Action', actionSchema);