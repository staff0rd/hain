'use strict';

const co = require('co');
const logger = require('../shared/logger');
const globalProxyAgent = require('./global-proxy-agent');
const procMsg = require('./proc-msg');
const apiProxy = require('./api-proxy');
const PreferencesObject = require('../shared/preferences-object');

// Create a local copy of app-pref object
const globalPrefObj = new PreferencesObject(null, 'global', {});

const workerContext = {
  app: apiProxy.appProxy,
  toast: apiProxy.toastProxy,
  shell: apiProxy.shellProxy,
  logger: apiProxy.loggerProxy,
  globalPreferences: globalPrefObj
};

let plugins = null;
const workerExports = {};

function handleExceptions() {
  process.on('uncaughtException', (err) => logger.error(err));
}

workerExports.initialize = function (payload) {
  return co(function* () {
    handleExceptions();
    // TODO 주석 풀기
    // globalPrefObj.update({});
    // globalProxyAgent.initialize(globalPrefObj);

    plugins = require('./plugins')(workerContext);
    yield* plugins.initialize();

    procMsg.send('notify-plugins-loaded');
  }).catch((e) => {
    const err = e.stack || e;
    procMsg.send('on-error', err);
    logger.error(err);
  });
};

workerExports.searchAll = function (payload) {
  const { query, ticket } = payload;
  const resFunc = (obj) => {
    const resultData = {
      ticket,
      type: obj.type,
      payload: obj.payload
    };
    procMsg.send('request-add-results', resultData);
  };
  plugins.searchAll(query, resFunc);
};

workerExports.execute = function (__payload) {
  const { pluginId, id, payload } = __payload;
  plugins.execute(pluginId, id, payload);
};

workerExports.renderPreview = function (__payload) {
  const { ticket, pluginId, id, payload } = __payload;
  const render = (html) => {
    const previewData = { ticket, html };
    procMsg.send('request-render-preview', previewData);
  };
  plugins.renderPreview(pluginId, id, payload, render);
};

workerExports.buttonAction = function (__payload) {
  const { pluginId, id, payload } = __payload;
  plugins.buttonAction(pluginId, id, payload);
};

function handleProcessMessage(msg) {
  try {
    const { channel, payload } = msg;
    const exportFunc = workerExports[channel];
    exportFunc(payload);
  } catch (e) {
    const err = e.stack || e;
    procMsg.send('on-error', err);
    logger.error(err);
  }
}

process.on('message', handleProcessMessage);

// const msgHandlers = {
//   execute: (_payload) => {
//   },
//   renderPreview: (_payload) => {
//   },
//   buttonAction: (_payload) => {
//   },
//   getPluginPrefIds: (payload) => {
//     const prefIds = plugins.getPrefIds();
//     procMsg.send('on-get-plugin-pref-ids', prefIds);
//   },
//   getPreferences: (payload) => {
//     const prefId = payload;
//     const pref = plugins.getPreferences(prefId);
//     procMsg.send('on-get-preferences', pref);
//   },
//   updatePreferences: (payload) => {
//     const { prefId, model } = payload;
//     plugins.updatePreferences(prefId, model);
//   },
//   commitPreferences: (payload) => {
//     plugins.commitPreferences();
//   },
//   resetPreferences: (payload) => {
//     const prefId = payload;
//     const pref = plugins.resetPreferences(prefId);
//     procMsg.send('on-get-preferences', pref);
//   },
//   updateGlobalPreferences: (payload) => {
//     const model = payload;
//     globalPrefObj.update(model);
//   }
// };
