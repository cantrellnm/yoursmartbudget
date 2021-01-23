const router = require('express').Router();
const { Transaction } = require('../models/transaction');
const { PlannedTransaction } = require('../models/plannedTransaction');
const { User } = require('../models/user');
const moment = require('moment');

router.get('/', (req, res, next) => {
  Transaction.find({user: req.user}).then( transactions => {
    res.status(200).json({data: { transactions }});
  }).catch( error => { next(error); });
});

router.post('/update', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No transaction id in request body']});
  let { id, data, planned } = req.body.data;
  // if (!data) res.status(400).json({errors: ['Transaction data not sent in request body']});
  Transaction.findById(id).then( async (transaction) => {
    if (!transaction) res.sendStatus(404); // not found
    if (transaction.user != req.user) res.sendStatus(403); // forbidden
    if (planned !== transaction.planned) {
      // update planned transaction
      if (transaction.planned) {
        // update old planned transaction
        let { planned_transaction, error, status} = await updatePlanned({ id: transaction.planned, user: req.user});
        var old_planned = planned_transaction;
        if (error) {
          return res.status(status).json({errors: ['Error updating planned transaction.', error]});
        }
      }
      if (planned) {
        // update new planned transaction
        let { planned_transaction, error, status } = await updatePlanned({ id: planned, date: transaction.data.date, user: req.user });
        var new_planned = planned_transaction;
        if (error) {
          return res.status(status).json({errors: ['Error updating planned transaction.', error]});
        }
      }
    }
    planned = (typeof planned !== 'undefined') ? planned : transaction.planned;
    transaction.set({
      data: data || transaction.data,
      planned
    });
    transaction.save(function (err, updatedTransaction) {
      if (err) res.status(500).json({errors: ['Error saving transaction.', err]});
      let data = {data: {transaction: updatedTransaction, planned_transactions: []}};
      if (old_planned) data.data.planned_transactions.push(old_planned);
      if (new_planned) data.data.planned_transactions.push(new_planned);
      res.status(200).json(data);
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding transaction.', error]});
    console.log(error);
  });
});

async function updatePlanned(args) {
  // function returnErrOrUpdated(err, updated) {
  //   return (err) ?
  //     { error: 'Error updating planned transaction.', status: 500 } :
  //     { planned_transaction: updated } ;
  // }
  function save(planned) {
    return new Promise( (resolve, reject) => {
      planned.save( (err, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    });
  }
  // if (planned_transaction.repeating) {
  //   return await PlannedTransaction.findByIdAndUpdate(id, { $set: {
  //       planStart: date,
  //       date: moment(date).add(moment.duration(parseInt(frequency[0]), frequency[1]))
  //     }}, { new: true }, returnErrOrUpdated);
  // } else {
  //   return await PlannedTransaction.findByIdAndUpdate(id, { $set: { completed: true }}, { new: true }, returnErrOrUpdated);
  // }
  return await PlannedTransaction.findById(args.id).then( async (planned_transaction) => {
    if (!planned_transaction) return { error: 'Not Found', status: 404 };
    if (planned_transaction.user != args.user) return { error: 'Forbidden', status: 403 }; // forbidden
    if (planned_transaction.repeating) {
      let frequency = planned_transaction.frequency.split('');
      if (args.date) {
        // setting new dates
        planned_transaction.oldStart = planned_transaction.planStart;
        planned_transaction.planStart = args.date;
        planned_transaction.date = moment(args.date).add(moment.duration(parseInt(frequency[0]), frequency[1])).format('YYYY-MM-DD');
      } else {
        // removing previously set dates
        planned_transaction.planStart = planned_transaction.oldStart;
        planned_transaction.date = moment(planned_transaction.date).subtract(moment.duration(parseInt(frequency[0]), frequency[1])).format('YYYY-MM-DD');
      }
    } else {
      planned_transaction.complete = (args.date) ? true : false;
    }
    return await save(planned_transaction)
      .then( updated => { return { planned_transaction: updated } })
      .catch( error => { return { error, status: 500 } });
  }).catch( error => { return { error, status: 500 } });
}

module.exports = router;
