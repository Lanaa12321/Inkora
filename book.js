const mongoose = require("mongoose");

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
    genre: {
      type: String
    },
    dateAdded: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["Want to Read", "Currently Reading", "Finished"],
      default: "Want to Read"
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    review: {
      type: String
    },
    reviewHistory: [
      {
        rating: Number,
        review: String,
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Book", bookSchema);