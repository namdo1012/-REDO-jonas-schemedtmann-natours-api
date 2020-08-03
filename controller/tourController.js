const Tour = require('../model/tourModel');

// Get All Tours
exports.getAllTour = async (req, res) => {
  try {
    // console.log(req.query);
    // const tours = await Tour.find();

    const queryObj = { ...req.query };
    console.log(queryObj);

    // 1) Filtering ? Why does we need to delete all those fields???
    // => Answer: To run advanced filtering, all those fields will be excuted later
    excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced Filtering: Operation: >=, <=, >, <
    // URL: 127.0.0.1:3000/api/v1/tours?duration[gte]=4&difficulty=easy
    // req.query: { duration: { gte: '4' }, difficulty: 'easy' }
    // Query in Mongoose: { duration: { $gte: '4' }, difficulty: 'easy' }
    // ===> the difference is '$'
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting
    // URL: ?sort=duration, -difficulty
    // req.query: { sort: 'duration,-difficulty' }
    // Query in Mongoose: query.sort(duration -difficulty)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4) Limit
    if (req.query.select) {
      const selectBy = req.query.sort.split(',').join(' ');
      query = query.select(selectBy);
    } else {
      query = query.select('-__v');
    }

    // 5) Pagination
    const page = req.query.page * 1 || 1;
    const limitPerPage = req.query.limit * 1 || 100;
    const skip = (page - 1) * limitPerPage;

    query = query.skip(skip).limit(limitPerPage);

    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Get Tour by ID
exports.getTour = async (req, res) => {
  try {
    const tourID = req.params.id;
    const tour = await Tour.findById(tourID);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Create new Tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Update Tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(400).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Delete Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
