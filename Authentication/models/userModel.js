const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true }
  //department: { type: String, required: true },
 // gender: { type: String, required: true }
});

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Compare the password for login
UserSchema.methods.isValidPassword = async function (password) {
  try {
    console.log('Password:',password);
    console.log('this.password:',this.password);
    console.log('valid:',await bcrypt.compare(password, this.password));
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
