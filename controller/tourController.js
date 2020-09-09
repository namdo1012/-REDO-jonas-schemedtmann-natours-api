const Tour = require('../model/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');

// Config multer
const multerStorage = multer.memoryStorage();

// const filterUploadPhotos = (req, file, cb) => {
//   if ()
// }

const upload = multer({ storage: multerStorage });

exports.testUploadPhotos = (req, res, next) => {
  console.log(req.files);
  next();
};

exports.uploadTourPhotos = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // Resize cover image
  req.body.imageCover = `tour-cover-${req.params.id}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // Resize tour images
  req.body.images = [];

  const imagePromises = req.files.images.map(async (el, index) => {
    const filename = `tour-img-${req.params.id}-${Date.now()}-${
      index + 1
    }.jpeg`;

    await sharp(el.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${filename}`);

    req.body.images.push(filename);
  });

  await Promise.all(imagePromises);
  next();
});

const handlerFactory = require('./handlerFactory');
const sharp = require('sharp');

exports.aliasTop5CheapTours = (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = 5;
  req.query.fields = 'name,duration,price,ratingAverage,difficulty';

  next();
};

// Get All Tours
exports.getAllTour = handlerFactory.getAllModel(Tour);

// Get Tour by ID
exports.getTour = handlerFactory.getModel(Tour);

// Create new Tour
exports.createTour = handlerFactory.createModel(Tour);

// Update Tour
exports.updateTour = handlerFactory.updateModel(Tour);

// Delete Tour
exports.deleteTour = handlerFactory.deleteModel(Tour);

// Get Tour Statistic
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// Get Monthly Plan in Year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $project: {
        month: '$_id',
        tours: '$tours',
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
