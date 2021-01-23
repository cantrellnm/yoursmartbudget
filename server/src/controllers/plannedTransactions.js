const router = require('express').Router();
const { PlannedTransaction } = require('../models/plannedTransaction');
const { User } = require('../models/user');
const moment = require('moment');

router.get('/', (req, res, next) => {
  PlannedTransaction.find({user: req.user}).then( planned_transactions => {
    res.status(200).json({data: { planned_transactions }});
  }).catch( error => { next(error); });
});

router.post('/new', (req, res, next) => {
  if (!req.body || !req.body.data) res.status(400).json({errors: ['No data in request body']});
  validate(req, res);
  let { account, payee, date, amount, repeating, frequency, setAside } = req.body.data;
  PlannedTransaction.create({
    account,
    payee,
    date,
    amount,
    setAside,
    repeating: repeating || false,
    frequency: frequency || '',
    user: req.user
  }, async (error, planned_transaction) => {
    if (error) return next(error);
    User.findById(req.user).then( user => {
      user.plannedTransactions.push(planned_transaction);
      user.save();
    }).catch( error => { return next(error); });
    console.log('Created planned transaction: ' + planned_transaction.id);
    res.status(201).json({data: { planned_transaction }});
  });
});

router.post('/update', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No transaction id in request body']});
  validate(req, res);
  let { id, planStart, account, payee, date, amount, repeating, frequency, setAside, complete } = req.body.data;
  PlannedTransaction.findById(id).then( planned_transaction => {
    if (!planned_transaction) res.sendStatus(404); // not found
    if (planned_transaction.user != req.user) res.sendStatus(403); // forbidden
    planned_transaction.set({
      planStart: planStart || planned_transaction.planStart,
      account,
      payee,
      date,
      amount,
      setAside,
      repeating: repeating || false,
      frequency: frequency || '',
      complete: complete || false
    });
    planned_transaction.save(function (err, updatedTransaction) {
      if (err) res.status(500).json({errors: ['Error saving planned transaction.', err]});
      res.status(200).json({data: {planned_transaction: updatedTransaction}});
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding planned transaction.', error]});
    console.log(error);
  });
});

router.post('/delete', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No transaction id in request body']});
  let { id } = req.body.data;
  PlannedTransaction.findById(id).then( planned_transaction => {
    if (!planned_transaction) res.sendStatus(404); // not found
    if (planned_transaction.user != req.user) res.sendStatus(403); // forbidden
    planned_transaction.remove( () => {
      console.log('Deleted planned transaction: ' + id);
      res.sendStatus(204); // success, no content returned
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding planned transaction.', error]});
    console.log(error);
  });
});

function validate(req, res) {
  let { account, payee, amount, date } = req.body.data;
  if (!account || !payee || !amount || !date) res.status(400).json({errors: ['Account, payee, amount, or date not sent in request body']});
}

module.exports = router;
