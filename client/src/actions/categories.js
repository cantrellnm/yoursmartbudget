export default {
  LOAD_CATEGORIES:
    "smartbudget/LOAD_CATEGORIES",

  loadCategories: function(payload) {
    return (dispatch, getState) => {
      const { budgets } = getState();
      dispatch({
        type: this.LOAD_CATEGORIES,
        payload,
        budgets
      });
    };
  },
}
