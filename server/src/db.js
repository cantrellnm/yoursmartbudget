const mongoose = require('mongoose');
const envvar = require('envvar');

//Set up default mongoose connection
var mongoDB = envvar.string('DB_URI', 'mongodb://localhost:27017/dev');

module.exports = () => {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected');

  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
  //Get the default connection
  var db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  return db;
};
