export default {
  DISPLAY_MESSAGE:
    "smartbudget/DISPLAY_MESSAGE",
  CLOSE_MESSAGE:
    "smartbudget/CLOSE_MESSAGE",

  displayMessage: function(message) {
    return {
      type: this.DISPLAY_MESSAGE,
      payload: message
    }
  },
  closeMessage: function(message) {
    return {
      type: this.CLOSE_MESSAGE,
      payload: message
    }
  },
}
