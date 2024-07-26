const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  imageURL: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
    },
  ],
  category: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
