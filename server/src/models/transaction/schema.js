const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  data: {
    type: Object,
    required: [true],
  },
  planned: {
    type: ObjectId,
    default: null,
    ref: 'PlannedTransaction',
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
