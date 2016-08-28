'use strict';

const electron = require('electron');
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;

const platformUtil = require('../../../../platform-util');
const windowUtil = require('./window-util');

module.exports = class MainWindow {
  constructor() {
    this.browserWindow = null;
  }
  createWindow(onComplete) {
    const browserWindow = new BrowserWindow({
      width: 800,
      height: 530,
      alwaysOnTop: true,
      center: true,
      frame: false,
      show: false,
      closable: false,
      minimizable: false,
      maximizable: false,
      moveable: false,
      resizable: false,
      skipTaskbar: true
    });

    if (onComplete)
      browserWindow.webContents.on('did-finish-load', onComplete);

    browserWindow.webContents.on('new-window', (evt, url) => {
      shell.openExternal(encodeURI(url));
      evt.preventDefault();
    });
    browserWindow.loadURL(`file://${__dirname}/../../../../dist/index.html`);
    browserWindow.on('blur', () => {
      if (browserWindow.webContents.isDevToolsOpened())
        return;
      this.hide(true);
    });

    this.browserWindow = browserWindow;
  }
  show() {
    if (this.browserWindow === null)
      return;

    platformUtil.saveFocus();
    windowUtil.centerWindowOnSelectedScreen(this.browserWindow);
    this.browserWindow.show();
  }
  setQuery(query) {
    this.browserWindow.webContents.send('set-query', query);
  }
  hide(dontRestoreFocus) {
    if (this.browserWindow === null)
      return;
    this.browserWindow.hide();

    if (!dontRestoreFocus)
      platformUtil.restoreFocus();
  }
  toggle(query) {
    if (this.browserWindow === null)
      return;

    if (this.browserWindow.isVisible())
      this.hide();
    else {
      this.show();

      if (query !== undefined)
        this.setQuery(query);
    }
  }
  enqueueToast(message, duration) {
    this.browserWindow.webContents.send('enqueue-toast', { message, duration });
  }
  log(msg) {
    this.browserWindow.webContents.send('log', msg);
  }
  requestAddResults(ticket, type, payload) {
    this.browserWindow.webContents.send('request-add-results', { ticket, type, payload });
  }
  requestRenderPreview(ticket, html) {
    this.browserWindow.webContents.send('request-render-preview', { ticket, html });
  }
  notifyPluginsLoaded() {
    this.browserWindow.webContents.send('notify-plugins-loaded');
  }
  notifyPluginsReloading() {
    this.browserWindow.webContents.send('notify-plugins-reloading');
  }
  isContentLoading() {
    return this.browserWindow.webContents.isLoading();
  }
  isVisible() {
    return this.browserWindow.isVisible();
  }
};
