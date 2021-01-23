const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  item_id: {
    type: String,
    required: [true],
  },
  institution_id: {
    type: String,
    required: [true],
  },
  institution_name: {
    type: String,
    required: [true],
  },
  access_token: {
    type: String,
    required: [true],
  },
  refreshed: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  loginRequired: {
    type: Boolean,
    default: false
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
