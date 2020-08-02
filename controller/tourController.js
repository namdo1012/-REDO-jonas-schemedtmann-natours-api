// Get All Tours
exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all tours',
  });
};

// Create new Tour
exports.createTour = (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Create new tour',
  });
};
