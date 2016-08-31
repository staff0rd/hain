'use strict';

module.exports = class WorkerProxy {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }
  initialize(initialAppPref) {
    this.workerClient.rpc.call('initialize', { initialAppPref });
  }
  searchAll(ticket, query) {
    this.workerClient.rpc.call('searchAll', { ticket, query });
  }
  execute(pluginId, id, payload) {
    this.workerClient.rpc.call('execute', { pluginId, id, payload });
  }
  renderPreview(ticket, pluginId, id, payload) {
    this.workerClient.rpc.call('renderPreview', { ticket, pluginId, id, payload });
  }
  buttonAction(pluginId, id, payload) {
    this.workerClient.rpc.call('buttonAction', { pluginId, id, payload });
  }
};
