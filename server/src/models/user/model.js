const mongoose = require('mongoose');
const { schema } = require('./schema');

// add hooks here
// schema.pre('save', function() {
//   return doStuff().
//     then(() => doMoreStuff());
// });

schema.statics.findOrCreate = function(sub, callback) {
    var userObj = new this();
    this.findOne({open_id: sub}, (error, result) => {
        if (!result) {
            userObj.open_id = sub;
            userObj.save(callback);
        } else {
            callback(error, result);
        }
    });
};

const User = mongoose.model('User', schema);
module.exports = { User };
