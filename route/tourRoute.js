const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewRouter = require('../route/reviewRoute');

const router = express.Router();

// NESTED ROUTE
router.use('/:tourId/reviews', reviewRouter);

// USER PERMISSION
router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasTop5CheapTours, tourController.getAllTour);

router.route('/').get(tourController.getAllTour);
router.route('/:id').get(tourController.getTour);

// ADMIN, LEAD PERMISSION
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourPhotos,
    tourController.testUploadPhotos,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
