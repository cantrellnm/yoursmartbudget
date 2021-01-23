const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require('moment');

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
  repeating: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    default: ''
  },
  setAside: {
    type: Boolean,
    default: true
  },
  planStart: {
    type: String,
    default: moment().format('YYYY-MM-DD')
  },
  oldStart: {
    type: String,
    default: moment().format('YYYY-MM-DD')
  },
  complete: {
    type: Boolean,
    default: false
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
