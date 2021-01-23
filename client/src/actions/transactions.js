export default {
  LOAD_TRANSACTIONS:
    "smartbudget/LOAD_TRANSACTIONS",
  ADD_TRANSACTIONS:
    "smartbudget/ADD_TRANSACTIONS",
  UPDATE_TRANSACTION:
    "smartbudget/UPDATE_TRANSACTION",
  REFRESH_TRANSACTIONS:
    "smartbudget/REFRESH_TRANSACTIONS",
  REMOVE_TRANSACTIONS:
    "smartbudget/REMOVE_TRANSACTIONS",

  loadTransactions: function(transactions) {
    return (dispatch, getState) => {
      const { categories, accounts, settings } = getState();
      dispatch({
        type: this.LOAD_TRANSACTIONS,
        payload: transactions,
        categories,
        accounts,
        settings
      });
    };
  },
  addTransactions: function(transactions) {
    return (dispatch, getState) => {
      const { categories, accounts, settings } = getState();
      dispatch({
        type: this.ADD_TRANSACTIONS,
        payload: transactions,
        categories,
        accounts,
        settings
      });
    };
  },
  updateTransaction: function(transaction) {
    return (dispatch, getState) => {
      const { categories, accounts, settings } = getState();
      dispatch({
        type: this.UPDATE_TRANSACTION,
        payload: transaction,
        categories,
        accounts,
        settings
      });
    };
  },
  refreshTransactions: function(transactions) {
    return (dispatch, getState) => {
      const { categories, accounts, settings } = getState();
      dispatch({
        type: this.REFRESH_TRANSACTIONS,
        payload: transactions,
        categories,
        accounts,
        settings
      });
    };
  },
  removeTransactions: function(account_id) {
    return (dispatch, getState) => {
      const { categories, accounts, settings } = getState();
      dispatch({
        type: this.REMOVE_TRANSACTIONS,
        payload: account_id,
        categories,
        accounts,
        settings
      });
    };
  }
}
