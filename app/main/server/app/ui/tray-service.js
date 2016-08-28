'use strict';

const electron = require('electron');
const Tray = electron.Tray;
const Menu = electron.Menu;

const path = require('path');

module.exports = class TrayService {
  constructor(appService, autoLaunchService) {
    this.tray = null;

    this.appService = appService;
    this.autoLaunchService = autoLaunchService;
  }
  createTray() {
    const iconPath = process.platform !== 'linux' ?
      path.normalize(`${__dirname}/../../../../images/tray_16.ico`) :
      path.normalize(`${__dirname}/../../../../images/hain.png`);

    const autoLaunchActivated = this.autoLaunchService.isActivated;
    const tray = new Tray(iconPath);
    const menu = Menu.buildFromTemplate([
      {
        label: 'Hain', click: () => this.appService.open()
      },
      {
        label: 'Auto-launch', type: 'checkbox', checked: autoLaunchActivated,
        click: () => this.autoLaunchService.toggle()
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
