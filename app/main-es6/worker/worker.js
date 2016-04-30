/* global process */
'use strict';

const co = require('co');
const logger = require('../utils/logger');
const ObservableObject = require('../common/observable-object');
const globalProxyAgent = require('./global-proxy-agent');
const procMsg = require('./proc-msg');
const serverProxy = require('./server-proxy');

function ipcPipe(target, channel, msg) {
  procMsg.send('on-ipc-pipe', { target, channel, msg });
}

const globalPrefObj = new ObservableObject({});

const workerContext = {
  app: serverProxy.appProxy,
  toast: serverProxy.toastProxy,
  shell: serverProxy.shellProxy,
  logger: serverProxy.loggerProxy,
  globalPreferences: globalPrefObj
};

let plugins = null;

function handleProcessMessage(msg) {
  try {
    const { type, payload } = msg;
    const msgHandler = msgHandlers[type];
    msgHandler(payload);
  } catch (e) {
    const err = e.stack || e;
    procMsg.send('error', err);
    logger.log(err);
  }
}

function handleExceptions() {
  process.on('uncaughtException', (err) => {
    logger.log(err);
  });
}

function initialize(initialGlobalPref) {
  co(function* () {
    handleExceptions();
    globalPrefObj.update(initialGlobalPref);
    globalProxyAgent.initialize(globalPrefObj);

    plugins = require('./plugins')(workerContext);
    yield* plugins.initialize();

    procMsg.send('ready');
  }).catch((e) => {
    const err = e.stack || e;
    procMsg.send('error', err);
    logger.log(err);
  });
}

const msgHandlers = {
  initialize: (payload) => {
    const { initialGlobalPref } = payload;
    initialize(initialGlobalPref);
  },
  searchAll: (payload) => {
    const { query, ticket } = payload;
    const res = (obj) => {
      const pipeMsg = {
        ticket,
        type: obj.type,
        payload: obj.payload
      };
      ipcPipe('mainwindow', 'on-result', pipeMsg);
    };
    plugins.searchAll(query, res);
  },
  execute: (_payload) => {
    const { pluginId, id, payload } = _payload;
    plugins.execute(pluginId, id, payload);
  },
  renderPreview: (_payload) => {
    const { ticket, pluginId, id, payload } = _payload;
    const render = (html) => {
      const pipeMsg = { ticket, html };
      ipcPipe('mainwindow', 'on-render-preview', pipeMsg);
    };
    plugins.renderPreview(pluginId, id, payload, render);
  },
  getPluginPrefIds: (payload) => {
    const prefIds = plugins.getPrefIds();
    procMsg.send('on-get-plugin-pref-ids', prefIds);
  },
  getPreferences: (payload) => {
    const prefId = payload;
    const pref = plugins.getPreferences(prefId);
    procMsg.send('on-get-preferences', pref);
  },
  updatePreferences: (payload) => {
    const { prefId, model } = payload;
    plugins.updatePreferences(prefId, model);
  },
  commitPreferences: (payload) => {
    plugins.commitPreferences();
  },
  resetPreferences: (payload) => {
    const prefId = payload;
    const pref = plugins.resetPreferences(prefId);
    procMsg.send('on-get-preferences', pref);
  },
  updateGlobalPreferences: (payload) => {
    const model = payload;
    globalPrefObj.update(model);
  }
};

process.on('message', handleProcessMessage);
