const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const router = express.Router();

router.route('/').get(authController.isLoggedIn, viewController.getOverview);
router
  .route('/tour/:slug')
  .get(authController.isLoggedIn, viewController.getTourView);
router
  .route('/login')
  .get(authController.isLoggedIn, viewController.getLoginForm);

module.exports = router;
