'use strict';

const electron = require('electron');
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const windowUtil = require('./windowutil');

let browserWindow = null;

function generateUrl(prefId) {
  const baseUrl = `file://${__dirname}/../../../dist/preferences.html`;
  if (prefId)
    return `${baseUrl}#${prefId}`;
  return baseUrl;
}

function show(prefId) {
  const url = generateUrl(prefId);
  if (browserWindow !== null) {
    browserWindow.loadURL(url);
    return;
  }

  browserWindow = new BrowserWindow({
    width: 800,
    height: 650,
    show: false
  });
  browserWindow.loadURL(url);
  browserWindow.on('close', () => {
    browserWindow = null;

    const server = require('../server');
    server.commitPreferences();
  });

  browserWindow.webContents.on('will-navigate', (evt, url) => {
    shell.openExternal(encodeURI(url));
    evt.preventDefault();
  });
  browserWindow.setMenuBarVisibility(false);

  windowUtil.centerWindowOnSelectedScreen(browserWindow);
  browserWindow.show();
}

module.exports = {
  show
};
