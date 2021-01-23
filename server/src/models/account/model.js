const mongoose = require('mongoose');
const { schema } = require('./schema');
const { PendingTransaction } = require('../pendingTransaction');
const { PlannedTransaction } = require('../plannedTransaction');
const { Transaction } = require('../transaction');

// add hooks here
schema.pre('remove', function(next) {
  // 'this' is the account being removed
  PendingTransaction.deleteMany({account: this._id}).exec();
  PlannedTransaction.deleteMany({account: this._id}).exec();
  Transaction.deleteMany({account: this._id}).exec();
  next();
});

const Account = mongoose.model('Account', schema);
module.exports = { Account };
