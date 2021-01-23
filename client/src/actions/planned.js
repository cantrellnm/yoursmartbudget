export default {
  LOAD_PLANNED:
    "smartbudget/LOAD_PLANNED",
  NEW_PLANNED:
    "smartbudget/NEW_PLANNED",
  UPDATE_PLANNED:
    "smartbudget/UPDATE_PLANNED",
  DELETE_PLANNED:
    "smartbudget/DELETE_PLANNED",

  loadPlanned: function(planned) {
    return (dispatch, getState) => {
      const { accounts } = getState();
      dispatch({
        type: this.LOAD_PLANNED,
        payload: planned,
        accounts
      });
    };
  },
  newPlanned: function(transaction) {
    return (dispatch, getState) => {
      const { accounts } = getState();
      dispatch({
        type: this.NEW_PLANNED,
        payload: transaction,
        accounts
      });
    };
  },
  updatePlanned: function(transaction) {
    return (dispatch, getState) => {
      const { accounts } = getState();
      dispatch({
        type: this.UPDATE_PLANNED,
        payload: transaction,
        accounts
      });
    };
  },
  deletePlanned: function(transaction_id) {
    return (dispatch, getState) => {
      const { accounts } = getState();
      dispatch({
        type: this.DELETE_PLANNED,
        payload: transaction_id,
        accounts
      });
    };
  },
}
