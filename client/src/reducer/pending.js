import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";
import utils from '../utils/budgets';

const initialState = {
  all: [],
  visible: [],
  budgeted: {},
  unbudgeted: []
};

export default function reducer(state = initialState, action) {
  let { all, visible, budgeted, unbudgeted } = state;
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return { ...initialState };
    case actions.LOAD_PENDING:
      all = action.payload;
      break;
    case actions.NEW_PENDING:
      all = state.all.concat(action.payload);
      break;
    case actions.UPDATE_PENDING:
      all = state.all.map( transaction => { return (transaction._id === action.payload._id) ? action.payload : transaction ; });
      break;
    case actions.DELETE_PENDING:
      all = state.all.filter(transaction => transaction._id !== action.payload);
      break;
    default:
      return state;
  }
  if (action.accounts && action.accounts.all) {
    visible = all.length ? all.filter( trans => {
      let account = action.accounts.all.find( acc => acc._id === trans.account );
      return (account && account.hidden) ? false : true ;
    }) : [];
  }
  if (visible.length) {
    if (action.categories && Object.keys(action.categories.budgeted).length) {
      let categorized = utils.categorizeTransactions(visible, action.categories.budgeted);
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
  return { ...state, all, visible, budgeted, unbudgeted };
}
