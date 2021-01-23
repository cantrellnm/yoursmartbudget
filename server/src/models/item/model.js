const mongoose = require('mongoose');
const { schema } = require('./schema');
const { Account } = require('../account');
const envvar = require('envvar');
const encrypt = require('mongoose-encryption');

// generated pair of 32-byte and 64-byte base64 strings
const encKey = envvar.string('ENCRYPTION_KEY', 'wDwddqocjWuUMXcJ2M0zoguH9C6siUOa-vY2Fii7qo8');
const sigKey = envvar.string('SIGNING_KEY', 'sOJ0ej0lUaWCPfMpSTHlKH_-M9wNmygXsbph3T3rMLJFGbtgezIehBKcoJJINM235fB68DyOlD4bFieWjjuQyg');

// add hooks here
schema.pre('remove', async function(next) {
  // 'this' is the item being removed
  let accounts = await Account.find({item: this._id});
  for (let account of accounts) {
    await account.remove();
  }
  next();
});

const encryptOptions = {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['item_id', 'access_token'],
  additionalAuthenticatedFields: ['institution_id', 'institution_name', 'user', 'createdAt']
};
schema.plugin(encrypt, encryptOptions);
// This adds _ct and _ac fields to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt, decrypt, sign, and authenticate instance methods

const Item = mongoose.model('Item', schema);
module.exports = { Item };
