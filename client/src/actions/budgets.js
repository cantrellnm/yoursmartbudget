export default {
  LOAD_BUDGETS:
    "smartbudget/LOAD_BUDGETS",
  NEW_BUDGET:
    "smartbudget/NEW_BUDGET",
  UPDATE_BUDGET:
    "smartbudget/UPDATE_BUDGET",
  DELETE_BUDGET:
    "smartbudget/DELETE_BUDGET",

  loadBudgets: function(payload) { // payload is budgets
    return (dispatch, getState) => {
      const { budgets, settings } = getState();
      dispatch({
        type: this.LOAD_BUDGETS,
        payload,
        budgets,
        settings
      });
    };
  },
  newBudget: function(payload) { // payload is budget
    return (dispatch, getState) => {
      const { budgets, settings } = getState();
      dispatch({
        type: this.NEW_BUDGET,
        payload,
        budgets,
        settings
      });
    };
  },
  updateBudget: function(payload) { // payload is budget
    return (dispatch, getState) => {
      const { budgets, settings } = getState();
      dispatch({
        type: this.UPDATE_BUDGET,
        payload,
        budgets,
        settings
      });
    };
  },
  deleteBudget: function(payload) { // payload is budget_id
    return (dispatch, getState) => {
      const { budgets, settings } = getState();
      dispatch({
        type: this.DELETE_BUDGET,
        payload,
        budgets,
        settings
      });
    };
  },
}
