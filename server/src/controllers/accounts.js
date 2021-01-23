const router = require('express').Router();
const { Account } = require('../models/account');

// router.get('/', (req, res, next) => {
//   Account.find({user: req.user}).then( accounts => {
//     res.status(200).json({data: { accounts }});
//   }).catch( error => { next(error); });
// });

router.post('/update', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No account id in request body']});
  let { id, nickname, hidden } = req.body.data;
  Account.findById(id).then( (account) => {
    if (!account) res.sendStatus(404); // not found
    if (account.user != req.user) res.sendStatus(403); // forbidden
    if (typeof hidden === 'undefined') hidden = account.hidden;
    account.set({
      nickname: nickname || account.nickname,
      hidden
    });
    account.save(function (err, updatedAccount) {
      if (err) res.status(500).json({errors: ['Error saving account.', err]});
      let data = {data: {account: updatedAccount}};
      res.status(200).json(data);
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding account.', error]});
    console.log(error);
  });
});

module.exports = router;
