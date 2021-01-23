const api = require('express')();
const cors = require('cors');
const { errorHandler } = require('../middleware/error-handler');
const jwtVerify = require('../middleware/jwtVerify');

// CONTROLLERS
const users = require('../controllers/users');
const items = require('../controllers/items');
const accounts = require('../controllers/accounts');
const budgets = require('../controllers/budgets');
const transactions = require('../controllers/transactions');
const pendingTransactions = require('../controllers/pendingTransactions');
const plannedTransactions = require('../controllers/plannedTransactions');

const routersInit = () => {
  // let whitelist = ['http://localhost:3000', 'http://localhost:3000/', 'http://localhost:8000', 'http://localhost:8000/'];
  let corsOptions = {
    // origin: (origin, callback) => {
    //   (!origin || whitelist.indexOf(origin) !== -1) ? callback(null, true) : callback(new Error(`Request from ${origin} not allowed by CORS`)) ;
    // },
    origin: true
  }
  api.use(cors(corsOptions));

  api.use(jwtVerify);

  // register api points
  api.get('/test', (req, res) => {
    res.json({'message': 'Succesful GET, well done.'});
  });
  api.use('/user', users);
  api.use('/item', items);
  api.use('/account', accounts);
  api.use('/budget', budgets);
  api.use('/transaction', transactions);
  api.use('/pending', pendingTransactions);
  api.use('/planned', plannedTransactions);

  // catch api errors
  api.use(errorHandler);

  return api;
};

module.exports = routersInit;
