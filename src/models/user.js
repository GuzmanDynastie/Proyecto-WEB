const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { type: String, required: true, maxlength: 50},
    surname: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, maxlength: 50 },
    password: { type: String, required: true },
    image: { type: String, required: false , default: ''},
    role: { type: String, required: true, default: 'user' },
    status: { type: Boolean, required: true, default: true }
});

userSchema.methods.encryptPassword = async (password) => {
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt);
   return hash;
};

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('users', userSchema);