const mongoose = require('mongoose');
const express = require('express');
const reviewControlller = require('./../controller/reviewController');
const authController = require('../controller/authController');

// NESTED ROUTE
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/:id')
  .get(reviewControlller.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewControlller.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewControlller.deleteReview
  );

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
