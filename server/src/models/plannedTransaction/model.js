const mongoose = require('mongoose');
const { schema } = require('./schema');
const { Transaction } = require('../transaction');

// add hooks here
schema.pre('remove', function(next) {
  // 'this' is the planned transaction being removed
  Transaction.updateMany({planned: this._id}, { $set: { planned: null } }).exec();
  next();
});

const PlannedTransaction = mongoose.model('PlannedTransaction', schema);
module.exports = { PlannedTransaction };
