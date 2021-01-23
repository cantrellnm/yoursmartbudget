import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";

const initialState = {
  all: [],
  visible: []
};

export default function reducer(state = initialState, action) {
  let { all, visible } = state;
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      all = [];
      visible = [];
      break;
    case actions.LOAD_PLANNED:
      all = action.payload;
      break;
    case actions.NEW_PLANNED:
      all = state.all.concat(action.payload);
      break;
    case actions.UPDATE_PLANNED:
      all = state.all.map( transaction => { return (transaction._id === action.payload._id) ? action.payload : transaction ; });
      break;
    case actions.DELETE_PLANNED:
      all = state.all.filter(transaction => transaction._id !== action.payload);
      break;
    default:
      return state;
  }
  if (action.accounts && action.accounts.all) {
    visible = all.length ? all.filter( trans => {
      if (trans.complete) return false;
      let account = action.accounts.all.find( acc => acc._id === trans.account );
      return (account && account.hidden) ? false : true ;
    }) : [];
  }
  return { ...state, all, visible };
}
