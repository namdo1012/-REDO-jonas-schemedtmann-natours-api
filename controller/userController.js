const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user update password here
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        400,
        'This route is not for password update. Please user /updatePassword instead!'
      )
    );

  // Get user from db and update allowed fields [email, name]
  const user = await User.findById(req.user.id);
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  await user.save();

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
