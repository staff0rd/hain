'use strict';

const PreferencesObject = require('../shared/preferences-object');
const SimpleStore = require('../shared/simple-store');
const conf = require('../conf');

const store = SimpleStore(conf.APP_PREF_DIR);
const appPrefSchema = require('./app-pref-schema');
const nonce = require('../shared/nonce');

module.exports = new PreferencesObject(store, 'hain', appPrefSchema, nonce);
