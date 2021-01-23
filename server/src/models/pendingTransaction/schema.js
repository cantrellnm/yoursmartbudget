const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  payee: {
    type: String,
    required: [true],
  },
  date: {
    type: String,
    required: [true],
  },
  amount: {
    type: Number,
    required: [true],
  },
  category: {
    type: [String],
    required: [true],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  account: {
    type: ObjectId,
    required: [true],
    ref: 'Account',
  },
  user: {
    type: ObjectId,
    required: [true],
    ref: 'User',
  }
});

module.exports = { schema };
