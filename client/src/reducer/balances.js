import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";

const initialState = {
  all: [],
  items: {}
};

export default function reducer(state = initialState, action) {
  let { all, items } = state;
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      all = [];
      items = {};
      break;
    case actions.LOAD_BALANCES:
      all = action.payload;
      break;
    case actions.ADD_BALANCES:
      // used when creating new link and no chance of duplicates
      all = state.all.concat(action.payload);
      break;
    // case UPDATE_BALANCE:
    //   return { ...state, all: state.all.map( balance => { return (balance.account === action.payload.account) ? action.payload : balance ; }) };
    case actions.REFRESH_BALANCES:
      // used when refreshing item balances and transactions, each account has only one balance so matching by account
      all = state.all.map( balance => {
          return action.payload.find( bal => bal.account === balance.account) || balance
        })  // updates balances if already in state
        .concat(action.payload.filter( balance => {
          return !state.all.find( bal => bal.account === balance.account );
        })); // concat new balances that didn't already exist
      break;
    case actions.REMOVE_BALANCES:
      // receives account id, used when deleting item and its accounts
      all = state.all.filter(balance => balance.account !== action.payload);
      break;
    default:
      return state;
  }
  if (all.length && action.items && action.items.all && action.accounts && action.accounts.all) {
    action.items.all.forEach( item => {
      if (items[item._id]) delete items[item._id];
      let accounts = action.accounts.all.filter( acc => acc.item === item._id);
      if (accounts.length) {
        items[item._id] = [];
        accounts.forEach( acc => {
          if (action.type !== actions.REMOVE_BALANCES || acc._id !== action.payload) {
            let balance = all.find(bal => bal.account === acc._id);
            if (balance) items[item._id].push(balance);
          }
        });
      }
    });
  }
  return { ...state, all, items };
}
