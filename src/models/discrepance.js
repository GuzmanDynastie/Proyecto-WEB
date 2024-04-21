const mongoose = require('mongoose');
const { Schema } = mongoose;

const discrepanceSchema = new Schema({
    discrepance: { type: String, required: true}
});

module.exports = mongoose.model('discrepance', discrepanceSchema);