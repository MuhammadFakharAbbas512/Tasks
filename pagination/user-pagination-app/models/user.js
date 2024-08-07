const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/Auth');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;