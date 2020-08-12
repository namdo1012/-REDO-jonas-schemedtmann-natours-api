const User = require('./../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);

  // Hide user's password data before send to clients
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check user input both password and email
  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password!'));
  }

  // Find user in db with email and check correct password
  // const user = await User.findOne({ password, email });
  // ***I have got a problem right here when call find() instead of findOne() method.
  // It will lead to 'user' will be a arrray, not a document then we cannot call user.correctPassword after that!
  const user = await User.findOne({ email }).select('+password');
  const isCorrectPassword = await user.correctPassword(password, user.password);

  if (!user || !isCorrectPassword) {
    return next(new AppError(401, 'Incorrect password or email'));
  }

  // Create token and send to user
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get token from header and check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new AppError(401, 'You are not logging in! Please log in to get access')
    );
  }

  // Verify token

  next();
});
