'use strict';

const Registry = require('winreg');
const regKey = new Registry({
  hive: Registry.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

const VALUE_NAME = 'Hain';

module.exports = class AutoLaunch {
  constructor() {
    this.isActivated = false;
  }
  loadPreviousSetings() {
    return new Promise((resolve, reject) => {
      regKey.get(VALUE_NAME, (err, item) => {
        if (err)
          return reject(err);
        this.isActivated = (item !== null);
        resolve();
      });
    });
  }
  activate() {
    return new Promise((resolve, reject) => {
      regKey.set(VALUE_NAME, Registry.REG_SZ, `"${process.execPath}" --silent`, (err) => {
        if (err)
          return reject(err);
        return resolve();
      });
    });
  }
  deactivate() {
    return new Promise((resolve, reject) => {
      regKey.remove(VALUE_NAME, (err) => {
        if (err)
          return reject(err);
        return resolve();
      });
    });
  }
  toggle() {
    if (this.isActivated)
      return this.deactivate();
    return this.activate();
  }
};
