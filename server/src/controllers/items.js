const router = require('express').Router();
const plaid = require('plaid');
const envvar = require('envvar');
const moment = require('moment');

const { User } = require('../models/user');
const { Item } = require('../models/item');
const { Account } = require('../models/account');
const { Transaction } = require('../models/transaction');

const ENV = {
  client_id: envvar.string('PLAID_CLIENT_ID'),
  secret: envvar.string('PLAID_SECRET'),
  public_key: envvar.string('PLAID_PUBLIC_KEY'),
  env: envvar.string('PLAID_ENV', 'sandbox'),
  products: envvar.string('PLAID_PRODUCTS', 'transactions')
};

const client = new plaid.Client(
  ENV.client_id,
  ENV.secret,
  ENV.public_key,
  plaid.environments[ENV.env],
  {version: '2018-05-22'}
);

router.get('/environment', (req, res, next) => {
  res.status(200).json({ data: {
    plaid_products: ENV.products,
    plaid_environment: ENV.env,
    plaid_public_key: ENV.public_key
  }});
});

// create new item
router.post('/new', (req, res, next) => {
  if (!req.body || !req.body.data) res.status(400).json({errors: ['No request body or body does not contain data.']});
  var public_token = req.body.data.public_token,
      metadata = req.body.data.metadata;

  if (!public_token || !metadata) res.status(400).json({errors: ['No public token or metadata in request body.']});

  // CHECK IF AN ITEM ALREADY EXISTS BEFORE CREATING ONE!!!!
  // metadata { link_session_id, institution: { name, institution_id }, accounts: [] }
  Item.findOne({ institution_id: metadata.institution.institution_id, user: req.user }, (error, result) => {
    if (error) return next(error);
    if (result) {
      res.status(409).json({ errors: ['You are already connected to an account with this institution. Please refresh instead.']}); // status: conflict
    } else {
      exchangeToken(public_token, metadata, req, res, next);
    }
  });
});

// update existing item by generating a public token to use with Link
router.post('/update', (req, res, next) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No item in request body']});
  var itemid = req.body.data.id;

  Item.findById(itemid, (error, item) => {
    if (error) return next(error);
    if (!item) res.sendStatus(404);
    if (item.user.equals(req.user)) {
      createToken(item.access_token, req, res, next);
    } else {
      res.sendStatus(403); // forbidden
    }
  });
});

// refresh item accounts and transactions
router.post('/refresh', (req, res, next) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No item in request body']});
  var itemid = req.body.data.id;

  Item.findById(itemid, (error, item) => {
    if (error) return next(error);
    if (!item) res.sendStatus(404);
    if (item.user.equals(req.user)) {
      console.log('Item found, id: ' + item.id);
      getTransactions(item, req, res, next);
    } else {
      res.sendStatus(403); // forbidden
    }
  });
});

router.post('/delete', (req, res) => {
  if (!req.body || !req.body.data || !req.body.data.id) res.status(400).json({errors: ['No item id in request body']});
  let id = req.body.data.id;
  // need to delete accounts too!
  Item.findById(id).then( item => {
    if (!item) res.sendStatus(404); // not found
    if (item.user != req.user) res.sendStatus(403); // forbidden
    item.remove( () => {
      console.log('Deleted item: ' + id);
      res.sendStatus(204); // success, no content returned
    });
  }).catch( error => {
    res.status(500).json({errors: ['Error finding item.', error]});
    console.log(error);
  });
});

function exchangeToken(public_token, metadata, req, res, next) {
  client.exchangePublicToken(public_token)
    .then( (tokenResponse) => {
      // tokenResponse { access_token, item_id, request_id, status_code }
      if (!tokenResponse) res.status(502).json({ errors: ['Error retreiving token from Plaid']});
      access_token = tokenResponse.access_token;

      // Create Item for user
      Item.create({
        item_id: tokenResponse.item_id,
        institution_id: metadata.institution.institution_id,
        institution_name: metadata.institution.name,
        access_token: access_token,
        user: req.user
      }, async (error, item) => {
        if (error) return next(error);
        User.findById(req.user).then( user => {
          user.items.push(item);
          user.save();
        }).catch( error => { next(error); });
        console.log('Created item: ' + item.id);
        // Get transactions after creating item
        getTransactions(item, req, res, next);
      });
    }).catch( (error) => { next(error); });
}

// create public token to update item with Link
function createToken(access_token, req, res, next) {
  client.createPublicToken(access_token, (err, result) => {
    if (!err && result && result.public_token) {
      res.status(200).json({data: {
        public_token: result.public_token,
        plaid_products: ENV.products,
        plaid_environment: ENV.env,
        plaid_public_key: ENV.public_key
      }});
    } else {
      res.status(500).json({errors: ['Error creating public token for item.']})
    }
  });
}

function getTransactions(item, req, res, next) {
  let startDate = (req.body && req.body.date) ? req.body.date : moment().subtract(30, 'days').format('YYYY-MM-DD');
  let endDate = moment().format('YYYY-MM-DD');
  let options = {
    // count: 100,
    // offset: 0,
  };
  client.getTransactions(item.access_token, startDate, endDate, options)
    .then( async (transactionRes) => {
      // transactionRes { accounts: [], item: {}, request_id: '', status_code: #, total_transactions: #, transactions: []}
      console.log('Transactions retrieved for item: ' + item.id);
      let response = { request_id: transactionRes.request_id, status_code: transactionRes.status_code, accounts: [], balances: [], transactions: [] };
      // find or create accounts in db for item and return them in an array
      response.accounts = await processAccounts(transactionRes.accounts, transactionRes.item.institution_id, item.id, req.user);
      // get balance and transaction data for accounts, find or create transactions in db
      let matched = await matchAccounts(response.accounts, transactionRes, req.user); // returns { transactions, balances }
      response = { ...response, ...matched };
      item.refreshed = Date.now();
      item.loginRequired = false;
      item.save((err, refreshedItem) => {
        if (err) return next(err);
        let resItem = (({ _id, institution_id, institution_name, refreshed, createdAt, loginRequired }) => ({ _id, institution_id, institution_name, refreshed, createdAt, loginRequired }))(refreshedItem);
        response.item = resItem;
        res.status(200).json({data: response});
      });
    }).catch(async error => {
      if (error.error_code === 'ITEM_LOGIN_REQUIRED') {
        item.loginRequired = true;
        await item.save();
        let resItem = (({ _id, institution_id, institution_name, refreshed, createdAt, loginRequired }) => ({ _id, institution_id, institution_name, refreshed, createdAt, loginRequired }))(item);
        res.status(200).json({data: { item: resItem, errors: ['User login is required to refresh your account.'] } });
      } else {
        next(error);
      }
    });
}

async function processAccounts(accounts, institution_id, item_id, user_id) {
  // find or create accounts and then collect/return them in an array
  let accountDocs = [];
  for(let acc of accounts) {
    let doc;
    try {
      doc = await accountFindOrCreate(acc, institution_id, item_id, user_id);
    } catch(error) {
      if (error) console.log('accountFindOrCreate error: ' + error);
    }
    if (doc) accountDocs.push(doc);
  }
  return accountDocs;
}

async function matchAccounts(accounts, data, user_id) {
  let transactions = data.transactions;
  let balances = [];
  let processedTransactions = [];
  accounts.forEach( (acc) => {
    // find matching account
    let p_account = data.accounts.find( a => a.mask == acc.mask ); // find plaid account that matches mask
    let bal = p_account.balances;
    bal.account = acc.id;
    balances.push(bal);
  });
  try {
    processedTransactions = await Promise.all(
      transactions.map( async (trans) => {
        if (trans.pending) return null;
        return await processTransaction(trans, accounts, user_id, data);
      })
    );
    processedTransactions = processedTransactions.filter( trans => { return trans })
  } catch(error) {
    console.log('Error processing transactions: ' + error);
    return { transactions: [], balances }
  }
  return { transactions: processedTransactions, balances };
}

async function processTransaction(trans, accounts, user_id, data) {
  // find matching account
  let p_account = data.accounts.find( a => a.account_id == trans.account_id ); // find plaid account that matches account_id
  let account = accounts.find( a => a.mask == p_account.mask ); // find db account that matches mask of plaid account
  if (trans.category.length > 2) {
    trans.category = trans.category.slice(0, 2);
  }
  // strip account_id & transaction_id (which can change) and account_owner from transaction
  // do i want to strip location?
  delete trans.account_id;
  delete trans.account_owner;
  delete trans.transaction_id;

  return await transactionFindOrCreate(trans, account.id, user_id);
}

async function accountFindOrCreate(acc, institution_id, item_id, user_id) {
  // find or create an account in db for given item
  let result;
  try {
    result = await Account.findOne({
      mask: acc.mask, item: item_id, user: user_id
    });
  } catch(error) {
    if (error) console.log('Account.findOne error:' + error);
  }
  if (result) {
    console.log('Account found, id: ' + result.id);
    return result;
  } else {
    let official_name = acc.official_name || acc.name
    try {
      result = await Account.create({
        official_name: official_name,
        name: acc.name,
        mask: acc.mask,
        institution_id: institution_id,
        type: acc.type,
        subtype: acc.subtype,
        item: item_id,
        user: user_id
      });
      User.findById(user_id).then( user => {
        user.accounts.push(result);
        user.save();
      }).catch( error => { next(error); });
      console.log('Account created, id: ' + result.id);
      return result;
    } catch(error) {
      if (error) console.log('Account.create error:' + error);
    }
  }
}

async function transactionFindOrCreate(trans, account_id, user_id) {
  // find or create a transaction in db
  let result;
  try {
    result = await Transaction.findOne({
      'data.date': trans.date, 'data.name': trans.name, 'data.amount': trans.amount, account: account_id, user: user_id
    });
  } catch(error) {
    if (error) console.log('Transaction.findOne error:' + error);
  }
  if (result) {
    console.log('Transaction found, id: ' + result.id);
    return result;
  } else {
    try {
      result = await Transaction.create({
        data: trans,
        account: account_id,
        user: user_id
      }).catch( error => { next(error); });
      console.log('Transaction created, id: ' + result.id);
      User.findById(user_id).then( user => {
        if (!user) return next('User not found while trying to save new transaction.');
        user.transactions.push(result);
        user.save();
      }).catch( error => { next(error); });
      console.log('Transaction created, id: ' + result.id);
      result.data.new = true;
      return result;
    } catch(error) {
      if (error) console.log('Transaction.create error:' + error);
    }
  }
}

module.exports = router;
