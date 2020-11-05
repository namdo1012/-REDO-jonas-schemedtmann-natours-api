const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const handlerFactory = require('./handlerFactory');

// Allow nested routes
exports.getTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// Get All Reviews
exports.getAllReviews = handlerFactory.getAllModel(Review);

// Get Review By ID
exports.getReview = handlerFactory.getModel(Review);

// Create new Review
exports.createReview = handlerFactory.createModel(Review);

// Update Review
exports.updateReview = handlerFactory.updateModel(Review);

// Delete Review
exports.deleteReview = handlerFactory.deleteModel(Review);
