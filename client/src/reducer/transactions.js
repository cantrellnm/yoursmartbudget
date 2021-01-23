import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";
import moment from 'moment';
import utils from '../utils/budgets';

const initialState = {
  all: [],
  visible: [],
  planned: [],
  unbudgeted: [],
  budgeted: {}
};

export default function reducer(state = initialState, action) {
  let { all, visible, planned, unbudgeted, budgeted } = state;
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return { ...initialState };
    case actions.LOAD_TRANSACTIONS:
      all = action.payload;
      break;
    case actions.ADD_TRANSACTIONS:
      // used when creating new link and no chance of duplicates
      all = all.concat(action.payload);
      break;
    case actions.UPDATE_TRANSACTION:
      all = all.map( transaction => { return (transaction._id === action.payload._id) ? action.payload : transaction ; });
      break;
    case actions.REFRESH_TRANSACTIONS:
      // used when refreshing item balances and transactions
      // most transactions returned will be duplicates
      all = all.map( transaction => {
          // returns updated transaction or original from state
          return action.payload.find( trans => trans._id === transaction._id) || transaction;
        }) // concat new transactions
        .concat(action.payload.filter( transaction => { return !state.all.find( trans => trans._id === transaction._id ) }));
      break;
    case actions.REMOVE_TRANSACTIONS:
      // receives account id, used when deleting item and its accounts
      all = all.filter(transaction => transaction.account !== action.payload);
      break;
    default:
      return state; // no change to state so that rehydrate works
  }
  if (all.length && action.accounts && action.accounts.all) {
    let start_date = (action.settings.all && action.settings.all.budgetPeriod) ?
      moment().subtract(action.settings.all.budgetPeriod[0], action.settings.all.budgetPeriod[1]).format('YYYY-MM-DD') :
      moment().subtract(1, 'month').format('YYYY-MM-DD') ;
    visible = utils.filterHiddenAndDate(all, action.accounts.all, start_date);
  }
  if (visible.length) {
    if (action.categories && Object.keys(action.categories.budgeted).length) {
      let categorized = utils.categorizeTransactions(visible, action.categories.budgeted, action.settings.all.credit.categories.concat(action.settings.all.transferCategories));
      budgeted = categorized.budgeted;
      unbudgeted = categorized.unbudgeted;
    } else {
      budgeted = {};
      unbudgeted = visible;
    }
  } else {
    budgeted = {};
    unbudgeted = [];
  }
  planned = visible.filter( transaction => { return transaction.planned });
  return { ...state, all, visible, planned, unbudgeted, budgeted };
}
