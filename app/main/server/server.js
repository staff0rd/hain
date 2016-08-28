'use strict';

const co = require('co');

const logger = require('../shared/logger');

const AppService = require('./app/app-service');
const WorkerClient = require('./worker/worker-client');
const ApiService = require('./worker/api-service');
const PrefManager = require('./preferences/pref-manager');
const WorkerHandler = require('./worker/worker-handler');

module.exports = class Server {
  constructor() {
    this.prefManager = new PrefManager();
    this.workerClient = new WorkerClient();
    this.appService = new AppService(this.prefManager, this.workerClient);
    this.apiService = new ApiService(this.appService);
    this.workerHandler = new WorkerHandler(this.workerClient, this.appService, this.apiService);
  }
  launch() {
    const self = this;
    return co(function* () {
      yield self.appService.initializeAndLaunch();
      self.workerClient.loadWorker();
      self.workerHandler.setupHandlers();
      self.apiService.loadApiModules();
    }).catch((e) => logger.error(e));
  }
};
