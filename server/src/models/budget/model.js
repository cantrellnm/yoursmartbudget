const mongoose = require('mongoose');
const { schema } = require('./schema');

// add hooks here
// schema.pre('save', function() {
//   return doStuff().
//     then(() => doMoreStuff());
// });

const Budget = mongoose.model('Budget', schema);
module.exports = { Budget };
