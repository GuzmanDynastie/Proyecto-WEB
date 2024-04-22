const mongoose = require('mongoose');
const { Schema } = mongoose;

const discrepanceSchema = new Schema({
    discrepance: { type: String, required: true},
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('discrepances', discrepanceSchema);