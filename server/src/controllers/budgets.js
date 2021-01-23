const router = require('express').Router();
const { Budget } = require('../models/budget');
const { User } = require('../models/user');

router.get('/', (req, res, next) => {
  Budget.find({user: req.user}).then( budgets => {
    res.status(200).json({data: { budgets }});
  }).catch( error => { next(error); });
});

router.post('/new', (req, res, next) => {
  if (!req.body || !req.body.data) res.status(400).json({errors: ['No data in request body']});
  validate(req, res);
  let { name, amount, categories } = req.body.data;
  Budget.create({
    name,
    amount,
    categories,
    user: req.user
  }, async (error, budget) => {
    if (error) return next(error);
    User.findById(req.user).then( user => {
      user.budgets.push(budget);
      user.save();
    }).catch( error => { next(error); });
    console.log('Created budget: ' + budget.id);
    res.status(201).json({data: { budget }});
  });
});

router.post('/update', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No budget id in request body']});
  validate(req, res);
  let { id, name, amount, categories } = req.body.data;
  Budget.findById(id).then( budget => {
    if (!budget) res.sendStatus(404); // not found
    if (budget.user != req.user) res.sendStatus(403); // forbidden
    budget.name = name;
    budget.amount = amount;
    budget.categories = categories;
    budget.save(function (err, updatedBudget) {
      if (err) res.status(500).json({errors: ['Error saving budget.', err]});
      res.status(200).json({data: {budget: updatedBudget}});
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding budget.', error]});
    console.log(error);
  });
});

router.post('/delete', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No budget id in request body']});
  let { id } = req.body.data;
  Budget.findById(id).then( budget => {
    if (!budget) res.sendStatus(404); // not found
    if (budget.user != req.user) res.sendStatus(403); // forbidden
    budget.remove( () => {
      console.log('Deleted budget: ' + id);
      res.sendStatus(204); // success, no content returned
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding budget.', error]});
    console.log(error);
  });
});

function validate(req, res) {
  let { name, amount, categories } = req.body.data;
  if (!name || !amount || !categories) res.status(400).json({errors: ['Name, amount, or categories not sent in request body']});
  if (!Array.isArray(categories)) res.status(400).json({errors: ['Categories should be an array.']});
}

module.exports = router;
