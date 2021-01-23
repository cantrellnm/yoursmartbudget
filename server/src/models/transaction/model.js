const mongoose = require('mongoose');
const { schema } = require('./schema');

// add hooks here
schema.post('init', function(doc) {
  doc.data.new = false;
});

const Transaction = mongoose.model('Transaction', schema);
module.exports = { Transaction };
