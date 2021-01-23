const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  name: {
    type: String,
    required: [true],
  },
  amount: {
    type: Number,
    required: [true],
  },
  categories: {
    type: [Array],
    required: [true],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  user: {
    type: ObjectId,
    required: [true],
    ref: 'User',
  }
});

module.exports = { schema };
