const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Overview Page',
    tours,
  });
});

exports.getTourView = catchAsync(async (req, res, next) => {
  const currentTour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  // console.log(currentTour);

  if (!currentTour) {
    return next(new AppError(404, 'There is no tour with that name!'));
  }

  // console.log(currentTour);
  res.status(200).render('tour', {
    title: currentTour.name,
    tour: currentTour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in your account',
  });
});

exports.getAccountPage = (req, res) => {
  res.status(200).render('account', {
    title: 'My Account',
  });
};
