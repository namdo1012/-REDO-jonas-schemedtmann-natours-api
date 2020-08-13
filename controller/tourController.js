const Tour = require('../model/tourModel');
const APIFeature = require('../utils/APIFeature');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTop5CheapTours = (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = 5;
  req.query.fields = 'name,duration,price,ratingAverage,difficulty';

  next();
};

// Get All Tours
exports.getAllTour = catchAsync(async (req, res, next) => {
  // console.log(req.query);
  const features = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get Tour by ID
exports.getTour = catchAsync(async (req, res, next) => {
  const tourID = req.params.id;
  const tour = await Tour.findById(tourID);
  // Tour.findOne({ _id: req.params.id })
  if (!tour) {
    return next(new AppError(404, 'No tour found with that ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Create new Tour
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// Update Tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  if (!tour) {
    return next(new AppError(404, 'No tour found with that ID!'));
  }

  res.status(400).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Delete Tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id, {
    useFindAndModify: true,
  });

  console.log(tour);
  if (!tour) {
    return next(new AppError(404, 'No tour found with that ID!'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
