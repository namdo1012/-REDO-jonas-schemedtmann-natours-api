const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Get Model By ID
exports.getModel = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError(404, 'No tour found with that ID!'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// Delete Model
exports.deleteModel = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, {
      useFindAndModify: true,
    });

    // console.log(doc);
    if (!doc) {
      return next(new AppError(404, 'No tour found with that ID!'));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// Update Model
exports.updateModel = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });

    if (!doc) {
      return next(new AppError(404, 'No doc found with that ID!'));
    }

    res.status(400).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// Create new Model
exports.createModel = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
