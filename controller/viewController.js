const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.render('overview', {
    title: 'Overview Page',
    tours,
  });
});

exports.getTourView = catchAsync(async (req, res, next) => {
  const currentTour = await Tour.find({ slug: req.params.slug });
  res.render('tour', {
    title: currentTour.name,
    tour: currentTour,
  });
});
