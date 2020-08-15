const mongoose = require('mongoose');
const express = require('express');
const reviewControlller = require('./../controller/reviewController');
const router = express.Router();

router.route('/').get(reviewControlller.getAllReviews);

module.exports = router;
