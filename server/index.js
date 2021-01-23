if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const envvar = require('envvar');
const express = require('express');
const dbConnect = require('./src/db');
const path = require('path');
const httpsRedirect = require('./src/middleware/https-redirect');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const db = dbConnect();

// MIDDLEWARE
app.enable('trust proxy'); //needed if behind a load balancer
app.use(httpsRedirect);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES
const api = require('./src/api');
app.use('/api', api());
app.use('/', express.static(path.join(__dirname, '../client/build')));
app.use('/*', express.static(path.join(__dirname, '../client/build')));

// START SERVER
const APP_PORT = envvar.number('PORT', 8000);
app.listen(APP_PORT, function() {
  console.log('server listening on port ' + APP_PORT);
});
