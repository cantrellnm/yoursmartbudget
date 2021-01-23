const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const defaultCategories = require('./categories');
const defaultSettings = require('./settings');

const schema = new Schema({
  open_id: {
    type: String,
    required: [true],
  },
  categories: {
    type: Object,
    default: defaultCategories,
  },
  settings: {
    type: Object,
    default: defaultSettings,
  },
  items: {
    type: [ ObjectId ],
    ref: 'Item',
  },
  accounts: {
    type: [ ObjectId ],
    ref: 'Account',
  },
  budgets: {
    type: [ ObjectId ],
    ref: 'Budget',
  },
  transactions: {
    type: [ ObjectId ],
    ref: 'Transaction'
  },
  pendingTransactions: {
    type: [ ObjectId ],
    ref: 'pendingTransaction',
  },
  plannedTransactions: {
    type: [ ObjectId ],
    ref: 'PlannedTransaction',
  },
  // merchants: {
  //   type: [ ObjectId ],
  //   ref: 'Merchant',
  // },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true],
  },
});

module.exports = { schema };
