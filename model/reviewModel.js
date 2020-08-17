const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  // Dont populate 'tour' when call API GetTour()
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// Idea: Group reviews on tour and calc quantity and avarage of reviews
// That's why we need to use static method here! (this reference to Model)
reviewSchema.statics.calcAverageRatings = async function (tourID) {
  try {
    const stats = await this.aggregate([
      {
        $match: { tour: tourID },
      },
      {
        $group: {
          _id: '$tour',
          numRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    console.log(stats);
  } catch (err) {
    console.log(err);
  }
};

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log('This:', this);
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
  // console.log(this.constructor);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
