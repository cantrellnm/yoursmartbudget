const moment = require('moment');

module.exports = {
  budgetStart: moment().startOf('month').format('YYYY-MM-DD'),
  budgetPeriod: ['1', 'month'],
  merchants: {},
  credit: {accounts: [], categories: []},
  transferCategories: [],
  arrange: {budgets: [], planned: []}
}
