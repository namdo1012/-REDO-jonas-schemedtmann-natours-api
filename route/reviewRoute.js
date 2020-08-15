const mongoose = require('mongoose');
const express = require('express');
const reviewControlller = require('./../controller/reviewController');
const router = express.Router();

router.route('/').get(reviewControlller.getAllReviews);
router.route('/:id').get(reviewControlller.getReview);
router.route('/').post(reviewControlller.createReview);

module.exports = router;
