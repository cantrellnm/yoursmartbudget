const plaid = require('plaid');
const envvar = require('envvar');
const fs = require('fs');

const ENV = {
  client_id: envvar.string('PLAID_CLIENT_ID'),
  secret: envvar.string('PLAID_SECRET'),
  public_key: envvar.string('PLAID_PUBLIC_KEY'),
  env: envvar.string('PLAID_ENV', 'sandbox')
};

const client = new plaid.Client(
  ENV.client_id,
  ENV.secret,
  ENV.public_key,
  plaid.environments[ENV.env],
  {version: '2018-05-22'}
);

function getCategories() {
  client.getCategories(function(err, response) {
    if (err) console.log(err);
    // response.categories is an array of category objects { category_id: '', group: '', hierarchy: [] }
    processCategories(response.categories);
  });
}

function processCategories(data) {
  let categories = {};
  data.forEach( obj => {
    let val2 = obj.hierarchy[1]
    let val1 = obj.hierarchy[0];
    if ( !categories[val1] ) categories[val1] = {};
    if ( val2 && !categories[val1][val2] ) categories[val1][val2] = { hidden: false, custom: false};
  });
  createFile(categories);
}

function createFile(categories) {
  let fileText = 'module.exports = ' + JSON.stringify(categories);
  fs.writeFileSync('./categories.js', fileText, 'utf8');
}

getCategories();
