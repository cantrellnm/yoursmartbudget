const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const account_types = ['brokerage', 'credit', 'depository', 'loan', 'mortgage', 'other'];
const account_subtypes = {
  brokerage: ['401k', 'brokerage', 'ira', 'retirement', 'roth', 'ugma'],
  credit: ['credit card', 'paypal', 'line of credit', 'rewards'],
  depository: ['cd', 'checking', 'savings', 'money market', 'paypal', 'prepaid'],
  loan: ['auto', 'commercial', 'construction', 'consumer', 'home', 'home equity',
        'loan', 'mortgage', 'overdraft', 'line of credit', 'student'],
  mortgage: ['home'],
  other: ['403B', 'cash management', 'cd', 'hsa', 'keogh', 'money market', 'mutual fund',
         'prepaid', 'recurring', 'rewards', 'safe deposit', 'sarsep', 'other']
}

const schema = new Schema({
  official_name: {
    type: String,
    required: [true],
  },
  name: {
    type: String,
    required: [true],
  },
  mask: {
    type: String,
    required: [true],
  },
  institution_id: {
    type: String,
    required: [true],
  },
  type: {
    type: String,
    enum: account_types,
    required: [true],
  },
  subtype: {
    type: String,
    enum: Object.values(account_subtypes).join().split(','),
    required: [true],
  },
  nickname: {
    type: String,
    required: [false],
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  item: {
    type: ObjectId,
    required: [true],
    ref: 'Item',
  },
  user: {
    type: ObjectId,
    required: [true],
    ref: 'User',
  }
});

module.exports = { schema };
