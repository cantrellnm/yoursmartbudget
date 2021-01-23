import actions from "../actions";
import { SESSION_TERMINATED, USER_EXPIRED } from "redux-oidc";

const initialState = {
  all: {},
  budgeted: {}
};

export default function reducer(state = initialState, action) {
  let { all, budgeted } = state;
  switch (action.type) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return {...state, all: {}, budgeted: {}};
    case actions.LOAD_CATEGORIES:
      all = action.payload;
      break;
    case actions.LOAD_BUDGETS:
      action.budgets.all = action.payload;
      break;
    case actions.NEW_BUDGET:
      action.budgets.all.push(action.payload);
      break;
    case actions.UPDATE_BUDGET:
      action.budgets.all = action.budgets.all.map( budget => { return (budget._id === action.payload._id) ? action.payload : budget ; });
      break;
    case actions.DELETE_BUDGET:
      action.budgets.all = action.budgets.all.filter(budget => budget._id !== action.payload);
      break;
    default:
      return state;
  }
  if (action.budgets && action.budgets.all.length) {
    budgeted = {};
    let categories = Object.keys(all);
    categories.forEach(cat => {
      let match = action.budgets.all.find(bud => {
        return bud.categories.find(bud_cat => {
          return bud_cat.length === 1 && bud_cat[0] === cat;
        });
      });
      if (match) {
        budgeted[cat] = match._id;
      } else {
        let subcategories = Object.keys(all[cat]);
        subcategories.forEach(subcat => {
          let match = action.budgets.all.find(bud => {
            return bud.categories.find(bud_cat => {
              return bud_cat.length === 2 && bud_cat[0] === cat && bud_cat[1] === subcat;
            });
          });
          if (match) {
            budgeted[cat+'|'+subcat] = match._id;
          }
        });
      }
    });
  }
  return {...state, all, budgeted};
}
