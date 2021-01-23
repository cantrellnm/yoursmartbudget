const router = require('express').Router();
const { User } = require('../models/user');

router.get('/', (req, res) => {
  User.findOne({_id: req.user}, '-open_id')
  .populate({path: 'items', model: 'Item'})
  .populate({path: 'accounts', model: 'Account', select: '-user'})
  .populate({path: 'budgets', model: 'Budget', select: '-user'})
  .populate({path: 'transactions', model: 'Transaction', select: '-user'})
  .populate({path: 'pendingTransactions', model: 'PendingTransaction', select: '-user'})
  .populate({path: 'plannedTransactions', model: 'PlannedTransaction', select: '-user'})
  .exec( (error, user) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: ['Error finding user.', error] });
    }
    if (!user) res.sendStatus(404);
    user.items = user.items.map( item => {
      let { _id, institution_id, institution_name, refreshed } = item;
      return { _id, institution_id, institution_name, refreshed };
    });
    res.status(200).json({data: user});
  });
});

router.post('/update', (req, res) => {
  // if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No user id in request body']});
  let { categories, settings } = req.body.data;
  // if (!categories || !settings) res.status(400).json({errors: ['User categories or settings not sent in request body']});
  User.findById(req.user).then( user => {
    if (!user) res.sendStatus(404); // not found
    // if (user.id != req.user) res.sendStatus(403); // forbidden
    user.set({
      categories: categories || user.categories,
      settings: settings || user.settings
    });
    user.save(function (err, updatedUser) {
      if (err) res.status(500).json({errors: ['Error saving user: ', err]});
      res.status(200).json({data: {categories: updatedUser.categories, settings: updatedUser.settings}});
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding user.', error]});
    console.log(error);
  });
});

module.exports = router;
