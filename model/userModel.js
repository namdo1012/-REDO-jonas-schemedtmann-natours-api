const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'User must have a name!'],
  },
  email: {
    type: String,
    require: [true, 'User must have a email!'],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, 'Please provid a valid email'],
    validate: {
      validator: function (el) {
        return validator.isEmail(el.toLowerCase());
      },
      message: 'Please provide a valid email',
    },
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'User must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return candidatePassword === userPassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
