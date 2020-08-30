const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

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
