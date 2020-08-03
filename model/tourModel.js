const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour must have less or equal than 40 characters'],
    minlength: [10, 'A tour must have more or equal than 10 character'],
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

  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be less than 5.0'],
  },

  ratingQuantity: {
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
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
