'use strict';

const uuid = require('uuid');
const logger = require('./logger');

const RPC_CHANNEL = '#rpc';

class RpcChannel {
  constructor(send, listen) {
    this.send = send;
    this.topicFuncs = {};
    this.waitingHandlers = {};
    this._startListen(listen);
  }
  _startListen(listen) {
    listen(RPC_CHANNEL, (msg) => {
      const msgType = msg.type;
      if (msgType === 'return') {
        this._handleReturnMessage(msg);
      } else if (msgType === 'call') {
        this._handleCallMessage(msg);
      }
    });
  }
  _handleReturnMessage(msg) {
    const { id, error } = msg;
    const waitingHandler = this.waitingHandlers[id];
    if (error !== undefined) {
      waitingHandler.reject(error);
      delete this.waitingHandlers[id];
      return;
    }

    const result = msg.result;
    waitingHandler.resolve(result);
    delete this.waitingHandlers[id];
  }
  _handleCallMessage(msg) {
    const { id, topic, payload } = msg;
    const topicFunc = this.topicFuncs[topic];
    if (topicFunc === undefined) {
      this.send(RPC_CHANNEL, { type: 'return', id, error: 'no_func' });
      return;
    }

    let result;
    try {
      result = topicFunc(payload);
    } catch (e) {
      logger.error(e);
      this.send(RPC_CHANNEL, { type: 'return', id, error: e });
      return;
    }

    const isPromise = (result && typeof result.then === 'function');
    if (!isPromise) {
      this.send(RPC_CHANNEL, { type: 'return', id, result });
      return;
    }

    result
      .then((x) => this.send(RPC_CHANNEL, { type: 'return', id, result: x }))
      .catch((e) => {
        logger.error(e);
        this.send(RPC_CHANNEL, { type: 'return', id, error: e });
      });
  }
  call(topic, payload) {
    const id = uuid.v4();
    return new Promise((resolve, reject) => {
      this.waitingHandlers[id] = { resolve, reject };
      this.send(RPC_CHANNEL, { type: 'call', id, topic, payload });
    });
  }
  define(topic, func) {
    this.topicFuncs[topic] = func;
  }
}

module.exports = {
  create: (send, listen) => {
    return new RpcChannel(send, listen);
  },
  createWithIpcRenderer: (ipc) => {
    return new RpcChannel(ipc.send.bind(ipc), (channel, listener) => {
      ipc.on(channel, (evt, msg) => listener(msg));
    });
  }
};
