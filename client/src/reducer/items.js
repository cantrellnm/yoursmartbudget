import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";

const initialState = {
  all: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return Object.assign({}, state, { all: [] });
    case actions.LOAD_ITEMS:
      return Object.assign({}, state, { all: action.payload });
    case actions.NEW_ITEM:
      return { ...state, all: state.all.concat(action.payload) };
    case actions.UPDATE_ITEM:
      return { ...state, all: state.all.map( item => { return (item._id === action.payload._id) ? action.payload : item ; }) };
    case actions.DELETE_ITEM:
      return { ...state, all: state.all.filter(item => item._id !== action.payload) };
    default:
      return state;
  }
}
