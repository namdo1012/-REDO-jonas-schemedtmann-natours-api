const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal than 40 characters'],
      minlength: [10, 'A tour must have more or equal than 10 character'],
    },

    slug: {
      type: String,
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tours must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'], //Info about values: Can't find in documentation
        message: 'Difficulty must be either easy, medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less than 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // 'this' only points to current doc on NEW document creation
          return val < this.price;
        },
        message: (props) =>
          `Discount price ${props.value} should be below regular price`,
      },
    },

    summary: {
      type: String,
      trim: true,
      required: 'A tour must have a summary',
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },

    images: {
      type: [String],
    },

    startDates: [Date],

    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point', 'startLocation must be a Point Type'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point', 'startLocation must be a Point Type'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEXING
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// Virtual populate: Keep reference to all reviews child but not need to create array of reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
