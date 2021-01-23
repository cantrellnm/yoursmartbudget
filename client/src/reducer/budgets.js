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
    case actions.LOAD_BUDGETS:
      return Object.assign({}, state, { all: action.payload });
    case actions.NEW_BUDGET:
      return { ...state, all: state.all.concat(action.payload) };
    case actions.UPDATE_BUDGET:
      return { ...state, all: state.all.map( budget => { return (budget._id === action.payload._id) ? action.payload : budget ; }) };
    case actions.DELETE_BUDGET:
      return { ...state, all: state.all.filter(budget => budget._id !== action.payload) };
    default:
      return state;
  }
}
