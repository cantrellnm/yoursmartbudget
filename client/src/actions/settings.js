export default {
  SAVE_SETTINGS:
    "smartbudget/SAVE_SETTINGS",

  saveSettings: function(settings) {
    return {
      type: this.SAVE_SETTINGS,
      payload: settings
    };
  },
}
