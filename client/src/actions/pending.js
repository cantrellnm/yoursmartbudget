export default {
  LOAD_PENDING:
    "smartbudget/LOAD_PENDING",
  NEW_PENDING:
    "smartbudget/NEW_PENDING",
  UPDATE_PENDING:
    "smartbudget/UPDATE_PENDING",
  DELETE_PENDING:
    "smartbudget/DELETE_PENDING",

  loadPending: function(pending) {
    return (dispatch, getState) => {
      const { accounts, categories } = getState();
      dispatch({
        type: this.LOAD_PENDING,
        payload: pending,
        accounts,
        categories
      });
    };
  },
  newPending: function(transaction) {
    return (dispatch, getState) => {
      const { accounts, categories } = getState();
      dispatch({
        type: this.NEW_PENDING,
        payload: transaction,
        accounts,
        categories
      });
    };
  },
  updatePending: function(transaction) {
    return (dispatch, getState) => {
      const { accounts, categories } = getState();
      dispatch({
        type: this.UPDATE_PENDING,
        payload: transaction,
        accounts,
        categories
      });
    };
  },
  deletePending: function(transaction_id) {
    return (dispatch, getState) => {
      const { accounts, categories } = getState();
      dispatch({
        type: this.DELETE_PENDING,
        payload: transaction_id,
        accounts,
        categories
      });
    };
  },
}
