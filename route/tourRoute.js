const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTour)
  .post(tourController.createTour);

module.exports = router;
