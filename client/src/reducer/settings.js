import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";

const initialState = {
  all: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return Object.assign({}, state);
    case actions.SAVE_SETTINGS:
      return Object.assign({}, state, { all: action.payload });
    default:
      return state;
  }
}
