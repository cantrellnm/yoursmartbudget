export default {
  LOAD_ITEMS:
    "smartbudget/LOAD_ITEMS",
  NEW_ITEM:
    "smartbudget/NEW_ITEM",
  UPDATE_ITEM:
    "smartbudget/UPDATE_ITEM",
  DELETE_ITEM:
    "smartbudget/DELETE_ITEM",

  loadItems: function(items) {
    return {
      type: this.LOAD_ITEMS,
      payload: items
    };
  },
  newItem: function(item) {
    return {
      type: this.NEW_ITEM,
      payload: item
    };
  },
  updateItem: function(item) {
    return {
      type: this.UPDATE_ITEM,
      payload: item
    };
  },
  deleteItem: function(id) {
    return {
      type: this.DELETE_ITEM,
      payload: id
    };
  },
}
