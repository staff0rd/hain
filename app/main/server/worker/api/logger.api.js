'use strict';

module.exports = class LoggerAPI {
  constructor(context) {
    this.appService = context.appService;
  }
  log(msg) {
    this.appService.mainWindow.log(msg);
  }
};
