'use strict';

const PreferencesObject = require('../../shared/preferences-object');
const SimpleStore = require('../../shared/simple-store');
const conf = require('../../conf');

const appPrefSchema = require('./app-pref-schema');

module.exports = class PrefManager {
  constructor() {
    this.prefObjs = {};

    this._setupAppPref();
  }
  _setupAppPref() {
    const store = SimpleStore(conf.APP_PREF_DIR);
    const appPrefObj = new PreferencesObject(store, 'hain', appPrefSchema);
    this.prefObjs['hain'] = appPrefObj;
  }
  getPref(prefId) {
    return this.prefObjs[prefId];
  }
  commitAll() {
    // TODO something
  }
};
