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
    case actions.DISPLAY_MESSAGE:
      return { ...state, all: state.all.concat(action.payload) };
    case actions.CLOSE_MESSAGE:
      return { ...state, all: state.all.filter(message => message !== action.payload) };
    default:
      return state;
  }
}
