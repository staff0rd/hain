'use strict';

const electron = require('electron');
const Tray = electron.Tray;
const Menu = electron.Menu;

const path = require('path');

module.exports = class TrayService {
  constructor(appService, autoLaunch) {
    this.tray = null;

    this.appService = appService;
    this.autoLaunch = autoLaunch;
  }
  createTray() {
    const iconPath = process.platform !== 'linux' ?
      path.normalize(`${__dirname}/../../../../images/tray_16.ico`) :
      path.normalize(`${__dirname}/../../../../images/hain.png`);

    const autoLaunchActivated = this.autoLaunch.isActivated;
    const tray = new Tray(iconPath);
    const menu = Menu.buildFromTemplate([
      {
        label: 'Hain', click: () => this.appService.open()
      },
      {
        label: 'Auto-launch', type: 'checkbox', checked: autoLaunchActivated,
        click: () => this.autoLaunch.toggle()
      },
      {
        type: 'separator'
      },
      {
        label: 'Preferences', click: () => this.appService.openPreferences()
      },
      {
        label: 'Restart', click: () => this.appService.restart()
      },
      {
        label: 'Quit', click: () => this.appService.quit()
      }
    ]);
    tray.on('click', () => this.appService.open());
    tray.setToolTip('Hain');
    tray.setContextMenu(menu);

    this.tray = tray;
  }
};
