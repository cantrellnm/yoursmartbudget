const mongoose = require('mongoose');
const { schema } = require('./schema');

// add hooks here
// schema.pre('remove', function(next) {
//   // do stuff
//   next();
// });

const PendingTransaction = mongoose.model('PendingTransaction', schema);
module.exports = { PendingTransaction };
