const catchAsync = require('./../utils/catchAsync');
// Delete Tour
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
