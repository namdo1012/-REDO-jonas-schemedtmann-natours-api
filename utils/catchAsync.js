module.exports = (fn) => {
  // Must return an function to assign to caller, if NOT: the caller will immediately call functino 'fn()'
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  // // If not return code will be like this.
  // catchAsync = (fn) => {
  //   fn(req, res, next).catch((err) => next(err));
  // };
  // // This function wil be immediately called --> ERROR
  // getTour = catchAsync(async(req, res));
};
