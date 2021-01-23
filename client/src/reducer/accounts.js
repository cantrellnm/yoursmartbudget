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
    case actions.LOAD_ACCOUNTS:
      all = action.payload;
      break;
    case actions.ADD_ACCOUNTS:
      all = state.all.concat(action.payload);
      break;
    case actions.UPDATE_ACCOUNT:
      all = state.all.map( account => { return (account._id === action.payload._id) ? action.payload : account ; });
      break;
    case actions.REFRESH_ACCOUNTS:
      all = state.all.map( account => action.payload.find( acc => acc._id === account._id) || account );
      break;
    case actions.REMOVE_ACCOUNTS:
      all = state.all.filter(account => account.item !== action.payload);
      break;
    default:
      return state;
  }
  if (all.length && action.items && action.items.all) {
    action.items.all.forEach( item => {
      if (items[item._id]) delete items[item._id];
      if (action.type !== actions.REMOVE_ACCOUNTS || action.payload !== item._id) {
        // don't create item key if that item's accounts were just removed
        items[item._id] = all.filter( acc => acc.item === item._id );
      }
    });
  }
  return { ...state, all, items };
}
