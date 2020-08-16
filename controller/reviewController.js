const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const handlerFactory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError(400, 'No review found with that ID'));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// Allow nested routes
exports.getTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// Create new Review
exports.createReview = handlerFactory.createModel(Review);

// Update Review
exports.updateReview = handlerFactory.updateModel(Review);

// Delete Review
exports.deleteReview = handlerFactory.deleteModel(Review);
