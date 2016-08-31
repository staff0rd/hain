'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const logger = require('../../shared/logger');
const RpcChannel = require('../../shared/rpc-channel');

module.exports = class WorkerClient extends EventEmitter {
  constructor() {
    super();

    this.workerProcess = null;
    this.rpc = RpcChannel.create('#worker', this.send.bind(this), this.on.bind(this));
  }
  reloadWorker() {
    logger.debug('WorkerWrapper: reloading worker');

    if (this.workerProcess !== null) {
      this.workerProcess.kill();
      this.workerProcess = null;
    }

    this.loadWorker();
  }
  loadWorker() {
    logger.debug('WorkerWrapper: loading worker');

    const workerPath = path.join(__dirname, '../../worker/index.js');
    if (!fs.existsSync(workerPath))
      throw new Error('can\'t execute plugin process');

    this.workerProcess = cp.fork(workerPath, [], {
      execArgv: ['--always-compact'],
      silent: true
    });
    this.workerProcess.on('message', (msg) => this._handleWorkerMessage(msg));
  }
  send(channel, payload) {
    this.workerProcess.send({ channel, payload });
  }
  _handleWorkerMessage(msg) {
    const { channel, payload } = msg;
    this.emit(channel, payload);
  }
};

// function mergeWorkerHandlers(handlers) {
//   workerHandlers = lo_assign(workerHandlers, handlers);
// }

// function handleWorkerMessage(msg) {
//   const handler = workerHandlers[msg.type];
//   if (handler === undefined)
//     throw new Error('can\'t find a worker handler');
//   handler(msg.payload);
// }

// const _preMsgQueue = [];
// let _readyToSendmsg = false;

// function reloadWorker() {
//   isPluginsReady = false;
//   _readyToSendmsg = false;

//   if (workerProcess !== null) {
//     workerProcess.kill();
//     workerProcess = null;
//   }
//   rpc.send('mainwindow', 'on-reloading');
//   loadWorker();
// }
// function waitForSendmsgReady() {
//   asyncutil.runWhen(() => (workerProcess !== null && workerProcess.connected), () => {
//     _readyToSendmsg = true;
//     while (_preMsgQueue.length > 0) {
//       const msg = _preMsgQueue.shift();
//       workerProcess.send(msg);
//     }
//   });
// }
// function sendmsg(type, payload) {
//   if (!_readyToSendmsg) {
//     _preMsgQueue.push({ type, payload });
//     return;
//   }
//   workerProcess.send({ type, payload });
// }

// function initialize(_app) {
//   app = _app;

//   loadWorker();
//   proxyHandler.initialize(_app);

//   electronApp.on('quit', () => {
//     try {
//       if (workerProcess)
//         workerProcess.kill();
//     } catch (e) { }
//   });
// }

// const appPrefId = 'Hain';
// const workerPrefHandlers = {
//   'on-get-plugin-pref-ids': (payload) => {
//     const pluginPrefIds = payload;
//     const appPrefItem = {
//       id: appPrefId,
//       group: 'Application'
//     };
//     const pluginPrefItems = pluginPrefIds.map(x => ({
//       id: x,
//       group: 'Plugins'
//     }));
//     const prefItems = [appPrefItem].concat(pluginPrefItems);
//     rpc.send('prefwindow', 'on-get-pref-items', prefItems);
//   },
//   'on-get-preferences': (payload) => {
//     const { prefId, schema, model } = payload;
//     rpc.send('prefwindow', 'on-get-preferences', { prefId, schema, model });
//   }
// };
// mergeWorkerHandlers(workerPrefHandlers);

// // Preferences
// rpc.on('getPrefItems', (evt, msg) => {
//   sendmsg('getPluginPrefIds');
// });

// rpc.on('getPreferences', (evt, msg) => {
//   const prefId = msg;
//   if (prefId === appPrefId) {
//     const schema = JSON.stringify(pref.schema);
//     const model = pref.get();
//     rpc.send('prefwindow', 'on-get-preferences', { prefId, schema, model });
//     return;
//   }
//   sendmsg('getPreferences', prefId);
// });

// rpc.on('updatePreferences', (evt, msg) => {
//   const { prefId, model } = msg;
//   if (prefId === appPrefId) {
//     pref.update(model);
//     return;
//   }
//   sendmsg('updatePreferences', msg);
// });

// rpc.on('resetPreferences', (evt, msg) => {
//   const prefId = msg;
//   if (prefId === appPrefId) {
//     const schema = JSON.stringify(pref.schema);
//     const model = pref.reset();
//     rpc.send('prefwindow', 'on-get-preferences', { prefId, schema, model });
//     return;
//   }
//   sendmsg('resetPreferences', prefId);
// });

// function commitPreferences() {
//   sendmsg('commitPreferences');

//   if (pref.isDirty) {
//     const globalPref = pref.get();
//     sendmsg('updateGlobalPreferences', globalPref);
//     pref.commit();
//   }
// }

// rpc.on('search', (evt, msg) => {
//   const { ticket, query } = msg;
//   sendmsg('searchAll', { ticket, query });
// });

// rpc.define('execute', function* (params) {
//   const { pluginId, id, payload } = params;
//   sendmsg('execute', { pluginId, id, payload });
// });

// rpc.on('renderPreview', (evt, msg) => {
//   const { ticket, pluginId, id, payload } = msg;
//   sendmsg('renderPreview', { ticket, pluginId, id, payload });
// });

// rpc.on('buttonAction', (evt, msg) => {
//   const { pluginId, id, payload } = msg;
//   sendmsg('buttonAction', { pluginId, id, payload });
// });

// rpc.define('close', function* () {
//   app.close();
// });

// module.exports = {
//   initialize,
//   commitPreferences,
//   reloadWorker,
//   get isLoaded() { return (workerProcess !== null && workerProcess.connected && isPluginsReady); }
// };
