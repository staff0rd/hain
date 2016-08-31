'use strict';

module.exports = class ToastAPI {
  constructor(context) {
    this.appService = context.appService;
  }
  enqueue(payload) {
    const { message, duration } = payload;
    this.appService.mainWindow.enqueueToast(message, duration);
  }
};
