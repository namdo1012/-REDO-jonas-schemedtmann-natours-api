const mongoose = require('mongoose');
const express = require('express');
const reviewControlller = require('./../controller/reviewController');
const authController = require('../controller/authController');

// NESTED ROUTE
const router = express.Router({ mergeParams: true });

router
  .route('/:id')
  .get(reviewControlller.getReview)
  .delete(reviewControlller.deleteReview);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewControlller.getTourUserId,
    reviewControlller.createReview
  )
  .get(reviewControlller.getAllReviews);

module.exports = router;
