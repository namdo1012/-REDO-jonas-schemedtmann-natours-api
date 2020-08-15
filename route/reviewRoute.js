const mongoose = require('mongoose');
const express = require('express');
const reviewControlller = require('./../controller/reviewController');
const authController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewControlller.getAllReviews);
router.route('/:id').get(reviewControlller.getReview);
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewControlller.createReview
  );

module.exports = router;
