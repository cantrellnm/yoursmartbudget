const router = require('express').Router();
const { PendingTransaction } = require('../models/pendingTransaction');
const { User } = require('../models/user');
const moment = require('moment');

router.get('/', (req, res, next) => {
  PendingTransaction.find({user: req.user}).then( pending_transactions => {
    res.status(200).json({data: { pending_transactions }});
  }).catch( error => { next(error); });
});

router.post('/new', (req, res, next) => {
  if (!req.body || !req.body.data) res.status(400).json({errors: ['No data in request body']});
  validate(req, res);
  let { account, payee, date, amount, category } = req.body.data;
  PendingTransaction.create({
    account,
    payee,
    date,
    amount,
    category,
    user: req.user
  }, async (error, pending_transaction) => {
    if (error) return next(error);
    User.findById(req.user).then( user => {
      user.pendingTransactions.push(pending_transaction);
      user.save();
    }).catch( error => { return next(error); });
    console.log('Created pending transaction: ' + pending_transaction.id);
    res.status(201).json({data: { pending_transaction }});
  });
});

router.post('/update', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No transaction id in request body']});
  validate(req, res);
  let { id, account, payee, date, amount, category } = req.body.data;
  PendingTransaction.findById(id).then( pending_transaction => {
    if (!pending_transaction) res.sendStatus(404); // not found
    if (pending_transaction.user != req.user) res.sendStatus(403); // forbidden
    pending_transaction.set({
      account,
      payee,
      date,
      amount,
      category
    });
    pending_transaction.save(function (err, updatedTransaction) {
      if (err) res.status(500).json({errors: ['Error saving pending transaction.', err]});
      res.status(200).json({data: {pending_transaction: updatedTransaction}});
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding pending transaction.', error]});
    console.log(error);
  });
});

router.post('/delete', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No transaction id in request body']});
  let { id } = req.body.data;
  PendingTransaction.findById(id).then( pending_transaction => {
    if (!pending_transaction) res.sendStatus(404); // not found
    if (pending_transaction.user != req.user) res.sendStatus(403); // forbidden
    pending_transaction.remove( () => {
      console.log('Deleted pending transaction: ' + id);
      res.sendStatus(204); // success, no content returned
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding pending transaction.', error]});
    console.log(error);
  });
});

function validate(req, res) {
  let { account, payee, amount,  date, category } = req.body.data;
  if (!account || !payee || !amount || !date || !category) res.status(400).json({errors: ['Account, payee, amount, or date not sent in request body']});
  if (!Array.isArray(category)) res.status(400).json({errors: ['Transaction category should be an array.']});
}

module.exports = router;
