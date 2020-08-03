class APIFeature {
  // query: query to use in mongoose, pass in is Tour.find() with purpose to chain multiple methods (Ex.: Tour.find().split().sort()...)
  // queryObj: query obj in url
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObjTmp = { ...this.queryObj };
    // 1) Filtering ? Why does we need to delete all those fields???
    // => Answer: To run advanced filtering, all those fields will be excuted later
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObjTmp[el]);

    // 2) Advanced Filtering: Operation: >=, <=, >, <
    // URL: 127.0.0.1:3000/api/v1/tours?duration[gte]=4&difficulty=easy
    // req.query: { duration: { gte: '4' }, difficulty: 'easy' }
    // Query in Mongoose: { duration: { $gte: '4' }, difficulty: 'easy' }
    // ===> the difference is '$'
    let queryStr = JSON.stringify(queryObjTmp);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this; // to chain multiple method
  }

  sort() {
    // 3) Sorting
    // URL: ?sort=duration, -difficulty
    // req.query: { sort: 'duration,-difficulty' }
    // Query in Mongoose: query.sort(duration -difficulty)
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 4) Limit
    if (this.queryObj.select) {
      const selectBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.select(selectBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 5) Pagination
    const page = this.queryObj.page * 1 || 1;
    const limitPerPage = this.queryObj.limit * 1 || 100;
    const skip = (page - 1) * limitPerPage;

    this.query = this.query.skip(skip).limit(limitPerPage);

    return this;
  }
}

module.exports = APIFeature;
