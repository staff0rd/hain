'use strict';

const electron = require('electron');
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const windowUtil = require('./window-util');
const EventEmitter = require('events');

module.exports = class PrefWindow extends EventEmitter {
  constructor() {
    super();

    this.browserWindow = null;
  }
  show(prefId) {
    const url = this._generateUrl(prefId);
    if (this.browserWindow !== null) {
      this.browserWindow.loadURL(url);
      return;
    }
    this._createAndShow(url);
  }
  _createAndShow(url) {
    this.browserWindow = new BrowserWindow({
      width: 800,
      height: 650,
      show: false
    });
    this.browserWindow.loadURL(url);
    this.browserWindow.on('close', () => {
      this.browserWindow = null;
      this.emit('close');
      // const server = require('../server');
      // server.commitPreferences();
    });

    this.browserWindow.webContents.on('will-navigate', (evt, _url) => {
      shell.openExternal(encodeURI(_url));
      evt.preventDefault();
    });
    this.browserWindow.setMenuBarVisibility(false);

    windowUtil.centerWindowOnSelectedScreen(this.browserWindow);
    this.browserWindow.show();
  }
  _generateUrl(prefId) {
    const baseUrl = `file://${__dirname}/../../../../dist/preferences.html`;
    if (prefId)
      return `${baseUrl}#${prefId}`;
    return baseUrl;
  }
};
