export default {
  LOAD_BALANCES:
    "smartbudget/LOAD_BALANCES",
  ADD_BALANCES:
    "smartbudget/ADD_BALANCES",
  // UPDATE_BALANCE:
  //   "smartbudget/UPDATE_BALANCE",
  REFRESH_BALANCES:
    "smartbudget/REFRESH_BALANCES",
  REMOVE_BALANCES:
    "smartbudget/REMOVE_BALANCES",

  loadBalances: function(balances) {
    return (dispatch, getState) => {
      const { items, accounts } = getState();
      dispatch({
        type: this.LOAD_BALANCES,
        payload: balances,
        items,
        accounts
      });
    };
  },
  addBalances: function(balances) {
    return (dispatch, getState) => {
      const { items, accounts } = getState();
      dispatch({
        type: this.ADD_BALANCES,
        payload: balances,
        items,
        accounts
      });
    };
  },
  // updateBalance: function(balance) {
  //   return {
  //     type: this.UPDATE_BALANCE,
  //     payload: balance
  //   };
  // },
  refreshBalances: function(balances) {
    return (dispatch, getState) => {
      const { items, accounts } = getState();
      dispatch({
        type: this.REFRESH_BALANCES,
        payload: balances,
        items,
        accounts
      });
    };
  },
  removeBalances: function(account_id) {
    return (dispatch, getState) => {
      const { items, accounts } = getState();
      dispatch({
        type: this.REMOVE_BALANCES,
        payload: account_id,
        items,
        accounts
      });
    };
  },
}
