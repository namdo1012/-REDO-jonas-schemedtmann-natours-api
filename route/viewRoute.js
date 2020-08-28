const express = require('express');
const viewController = require('../controller/viewController');

const router = express.Router();

router.route('/').get(viewController.getOverview);
router.route('/tour/:slug').get(viewController.getTourView);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;
