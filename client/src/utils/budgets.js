import moment from 'moment';

export const budgetPeriodAmount = (budgetPeriod, amount) => {
  if (budgetPeriod[1] === 'month') {
    return ((amount*100))/100;
  } else {
    switch (budgetPeriod[0]) {
      case '2':
        return ((amount*100)/2)/100;
      case '1':
        return ((amount*100)/4)/100;
      default: //'4'
        return ((amount*100))/100;
    }
  }
};

export const budgetAmountFromInput = (budgetPeriod, amount) => {
  if (budgetPeriod[1] === 'month') {
    return ((amount*100))/100;
  } else {
    switch (budgetPeriod[0]) {
      case '2':
        return ((amount*100) * 2)/100;
      case '1':
        return ((amount*100) * 4)/100;
      default: //'4'
        return ((amount*100))/100;
    }
  }
};

export const totalPlanned = (budgetStart, budgetPeriod, transactions, singlePeriod=false) => {
  // fix this to divvy up transaction amount across budget periods if relevant
  if (!budgetStart || !budgetPeriod || !transactions) return;
  let amount = 0;
  transactions.forEach( trans => amount += setAside(budgetStart, budgetPeriod, trans, singlePeriod));
  return amount/100;
}

export const setAside = (startBudget, budgetPeriod, transaction, singlePeriod=false) => {
  // single period true means return amount only from that budget period, not total
  if (!transaction.setAside) return 0;
  // returns amount * 100
  let willSpend = moment(transaction.date);
  let budgetStart = moment(startBudget);
  let periodDuration = moment.duration(parseInt(budgetPeriod[0]), budgetPeriod[1]);
  let budgetEnd = moment(startBudget).add(periodDuration);
  let planStart = moment(transaction.planStart);
  let daysToSave = Math.ceil(moment.duration(willSpend.diff(planStart)).asDays());
  let daysToBudgetEnd = (singlePeriod && planStart < budgetStart) ?
    Math.ceil(moment.duration(budgetEnd.diff(budgetStart)).asDays()) :
    Math.ceil(moment.duration(budgetEnd.diff(planStart)).asDays()) ;
  let amountPerDay = (transaction.amount * 100) / daysToSave;
  // if transaction date is within current budget period
  if (willSpend < budgetEnd) {
    let daysToWillSpend;
    if (singlePeriod) daysToWillSpend = Math.ceil(moment.duration(willSpend.diff(budgetStart)).asDays());
    if (transaction.repeating) {
      // set aside money for next transaction as well
      let nextWillSpend = moment(willSpend).add(transaction.frequency[0], transaction.frequency[1]);
      let nextDaysToSave = Math.ceil(moment.duration(nextWillSpend.diff(willSpend)).asDays());
      let nextDaysToBudgetEnd = Math.ceil(moment.duration(budgetEnd.diff(willSpend)).asDays());
      let nextAmountPerDay = (transaction.amount * 100) / nextDaysToSave;
      let nextTransactionAmount = nextAmountPerDay * nextDaysToBudgetEnd;
      return (singlePeriod) ?
        (amountPerDay * daysToWillSpend) + nextTransactionAmount :
        (transaction.amount * 100) + nextTransactionAmount ;
    } else {
      return (singlePeriod) ?
        amountPerDay * daysToWillSpend :
        transaction.amount * 100 ;
    }
  } else {
    return amountPerDay * daysToBudgetEnd; // returns amount * 100
  }
};

export const totalBudgeted = (budgetPeriod, budgets) => {
  let amount = 0;
  budgets.forEach( bud => amount += (budgetPeriodAmount(budgetPeriod, bud.amount) * 100));
  return amount/100;
};

export const totalAmount = (objs) => {
  let amount = 0;
  objs.forEach( o => amount += (o.data) ? (o.data.amount * 100) : (o.amount * 100));
  return amount/100;
};

export const budgetEndPassed = (period, start) => {
  let end = moment(start).add(parseInt(period[0]), period[1]);
  return (moment() >= end) ? true : false ;
};

export const adjustBudgetStart = (period, start) => {
  let adjustment = moment(start).add(parseInt(period[0]), period[1]).format('YYYY-MM-DD');
  if (budgetEndPassed(period, adjustment)) adjustment = adjustBudgetStart(period, adjustment);
  return adjustment;
};

export const budgetPercentPassed = (period, start) => {
  // returns percent of current budget period already passed, from start to today
  let today = moment();
  let end = moment(start).add(parseInt(period[0]), period[1]);
  let startToEnd = moment.duration(end.diff(start)).asDays();
  let startToToday = moment.duration(today.diff(start)).asDays();
  return startToToday * 100 / startToEnd;
};

export const sortByDate = (a, b, descending=true) => {
  if (descending) {
    if (a.data) {
      if (a.data.date > b.data.date) return -1;
      if (a.data.date < b.data.date) return 1;
    } else {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
    }
  } else {
    if (a.data) {
      if (a.data.date > b.data.date) return 1;
      if (a.data.date < b.data.date) return -1;
    } else {
      if (a.date > b.date) return 1;
      if (a.date < b.date) return -1;
    }
  }
  return 0;
};

export const categorizeTransactions = (visible, categories, ignoreCategories=[]) => {
  let transactions = {budgeted: {}, unbudgeted: []};
  visible.forEach(trans => {
    let cat = (trans.data) ? trans.data.category[0] : trans.category[0];
    let subcat = (trans.data) ? trans.data.category.join('|') : trans.category.join('|');
    let budget = (categories[cat]) ? categories[cat] : categories[subcat];
    if (budget) {
      transactions.budgeted[budget] = (transactions.budgeted[budget]) ? transactions.budgeted[budget].concat(trans) : [trans];
    }
  });
  let allbudgeted = combineBudgeted(transactions.budgeted);
  transactions.unbudgeted = visible.filter( transaction => { return !transaction.planned && !allbudgeted.find( trans => trans._id === transaction._id ) });
  if (transactions.unbudgeted.length && ignoreCategories.length) {
    transactions.unbudgeted = filterIgnoredCategories(transactions.unbudgeted, ignoreCategories);
  }
  return transactions;
};

export const filterHiddenAndDate = (transactions, accounts, start, end=moment().format('YYYY-MM-DD')) => {
  return transactions.filter( trans => {
    if (trans.data && (trans.data.date < start || trans.data.date > end)) return false;
    if (trans.date && (trans.date < start || trans.date > end)) return false;
    let account = accounts.find( acc => acc._id === trans.account );
    return (account && account.hidden) ? false : true ;
  });
};

export const filterAmountAndDate = (transactions, start, end=moment().format('YYYY-MM-DD')) => {
  let filtered = transactions.filter( trans => {
    if (trans.data) {
      if (trans.data.amount < 0) return false;
      if (trans.data.date < start) return false;
      if (trans.data.date > end) return false;
    } else {
      if (trans.amount < 0) return false;
      if (trans.date < start) return false;
      if (trans.date > end) return false;
    }
    return true;
  });
  return filtered;
};

export const combineBudgeted = (budgeted) => {
  let allbudgeted = [];
  Object.keys(budgeted).forEach( budget_id => { allbudgeted = allbudgeted.concat(budgeted[budget_id]); } );
  return allbudgeted;
};

export const filterIgnoredCategories = (transactions, categories) => {
  return transactions.filter( trans => {
    let trans_cat =  (trans.data) ? trans.data.category[0] : trans.category[0];
    let trans_subcat = (trans.data) ? trans.data.category.join('|') : trans.category.join('|');
    return (!categories.find( cat => { return cat.join('|') === trans_cat || cat.join('|') === trans_subcat }));
  });
};

export const balanceSummary = (accounts, balances) => {
  let summary = {cash: 0, credit: 0};
  if (accounts.length && (balances.length === accounts.length || balances.length > accounts.length)) {
    accounts.forEach((acc => {
      if (acc.hidden) return;
      let bal = balances.find(bal => bal.account === acc._id);
      if (bal) {
        if (isCredit(acc)) {
          summary.credit += bal.current * 100;
        } else {
          summary.cash += (bal.available || bal.current) * 100;
        }
      }
    }));
    if (summary.cash > 0) summary.cash = summary.cash/100;
    if (summary.credit > 0) summary.credit = summary.credit/100;
  }
  return summary;
};

export const isCredit = (account) => {
  let credit = ['credit', 'loan', 'mortgage'];
  return credit.indexOf(account.type) > -1;
};

export const netAccountsBalance = (accounts=[], balances=[], credit={accounts:[]}) => {
  accounts = accounts.filter(acc => {return !isCredit(acc) || credit.accounts.indexOf(acc._id) > -1});
  let summary = balanceSummary(accounts, balances);
  let balance = (summary.cash*100) - (summary.credit*100);
  return balance/100;
};

export default {
  budgetPeriodAmount,
  budgetAmountFromInput,
  totalPlanned,
  setAside,
  totalBudgeted ,
  totalAmount,
  budgetEndPassed,
  adjustBudgetStart,
  budgetPercentPassed,
  sortByDate,
  categorizeTransactions,
  filterHiddenAndDate,
  filterAmountAndDate,
  combineBudgeted,
  filterIgnoredCategories,
  balanceSummary,
  isCredit,
  netAccountsBalance
};
