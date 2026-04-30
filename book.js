const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Want to Read', 'Currently Reading', 'Finished'],
      default: 'Want to Read'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);