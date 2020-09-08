const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer');
const handlerFactory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const sharp = require('sharp');

// Config multer
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users/');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     const filename = `user-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

const multerStorage = multer.memoryStorage();

const fileUploadFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Not an image! Please upload only image'));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: fileUploadFilter });
exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  const resizedImage = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Get All User
exports.getAllUsers = handlerFactory.getAllModel(User);

// Get User By ID
exports.getUser = handlerFactory.getModel(User);

// Create new User
exports.createUser = handlerFactory.createModel(User);

// Update User
exports.updateUser = handlerFactory.updateModel(User);

// Delete User
exports.deleteUser = handlerFactory.deleteModel(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

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
  // console.log(user);
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.file) user.photo = req.file.filename;
  await user.save();

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// We actually not delete the user from DB. Just set user's state to false
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: 'false' },
    { new: true }
  );

  res.status(204).json({
    status: 'success',
    data: {
      user,
    },
  });
});
