'use strict';

const co = require('co');

const logger = require('../shared/logger');

const AppService = require('./app/app-service');
const WorkerClient = require('./worker/worker-client');
const WorkerProxy = require('./worker/worker-proxy');
const WorkerHandler = require('./worker/worker-handler');
const ApiService = require('./api/api-service');
const appPref = require('./preferences/app-pref');

module.exports = class Server {
  constructor() {
    this.workerClient = new WorkerClient();
    this.workerProxy = new WorkerProxy(this.workerClient);
    this.appService = new AppService(appPref, this.workerClient, this.workerProxy);
    this.apiService = new ApiService(this.appService);
    this.workerHandler = new WorkerHandler(this.workerClient, this.appService, this.apiService);
  }
  launch() {
    this.apiService.loadApiModules();
    this.workerHandler.initialize();
    return this.appService.initializeAndLaunch()
      .then(() => {
        this.workerClient.loadWorker();
        this.workerProxy.initialize(appPref.get());
      });
  }
};
