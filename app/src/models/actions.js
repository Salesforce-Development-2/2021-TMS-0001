// Import mongoose middleware
const mongoose = require('mongoose');

// Definition of actions model through schema interface
const actionSchema = mongoose.Schema({
    action: String
})

module.exports = mongoose.model('Action', actionSchema);