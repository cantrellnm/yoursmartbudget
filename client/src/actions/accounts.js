export default {
  LOAD_ACCOUNTS:
    "smartbudget/LOAD_ACCOUNTS",
  ADD_ACCOUNTS:
    "smartbudget/ADD_ACCOUNTS",
  UPDATE_ACCOUNT:
    "smartbudget/UPDATE_ACCOUNT",
  REFRESH_ACCOUNTS:
    "smartbudget/REFRESH_ACCOUNTS",
  REMOVE_ACCOUNTS:
    "smartbudget/REMOVE_ACCOUNTS",

  loadAccounts: function(accounts) {
    return (dispatch, getState) => {
      const { items } = getState();
      dispatch({
        type: this.LOAD_ACCOUNTS,
        payload: accounts,
        items
      });
    };
  },
  addAccounts: function(accounts) {
    return (dispatch, getState) => {
      const { items } = getState();
      dispatch({
        type: this.ADD_ACCOUNTS,
        payload: accounts,
        items
      });
    };
  },
  updateAccount: function(account) {
    return (dispatch, getState) => {
      const { items } = getState();
      dispatch({
        type: this.UPDATE_ACCOUNT,
        payload: account,
        items
      });
    };
  },
  refreshAccounts: function(accounts) {
    return (dispatch, getState) => {
      const { items } = getState();
      dispatch({
        type: this.REFRESH_ACCOUNTS,
        payload: accounts,
        items
      });
    };
  },
  removeAccounts: function(item_id) {
    return (dispatch, getState) => {
      const { items } = getState();
      dispatch({
        type: this.REMOVE_ACCOUNTS,
        payload: item_id,
        items
      });
    };
  }
};
