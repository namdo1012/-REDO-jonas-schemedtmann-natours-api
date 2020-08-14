const User = require('./../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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
    },
    token,
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
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded); //{ id: '5f33f354d05b7d4b4c0ae869', iat: 1597240149, exp: 1597240185 }

  // Check if user still exist (user haven't deleted right after token is issued)
  const user = await User.findById(decoded.id);
  console.log(user);

  if (!user) {
    return next(
      new AppError(401, 'The user belonging to this token is no longer exist')
    );
  }

  // Check if user changed password after the token is issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(401, 'User recently changed password. Please log in again')
    );
  }

  // At last, grant access to protected routes
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'You do not have permission to perform this action!')
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user from db by POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(404, 'There is no user with this email address'));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();

  // Save user again to db after update this.resettoken
  const save = await user.save();

  // Send resettoken mail to client
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minus)',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    // Delete resetToken's inf from db
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new AppError(
        500,
        'There was an error sending email. Please try again later'
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user from db based on reset token and check reset token expires??
  const resetToken = req.params.token;
  // console.log(resetToken);
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError(400, 'Token is invalid or has expired!'));

  // 2) If not expires, update password for user
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now() - 1000; // -1000 means to avoid password is changed after the token was issued again
  await user.save();

  // 3) Update passwordChangeAt if user saved to db successfully
  console.log(user);
  // 4) Log user in again
  createSendToken(user, 200, res);
});