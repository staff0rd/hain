'use strict';

const logger = require('../../shared/logger');

module.exports = class WorkerHandler {
  constructor(workerClient, appService, apiService) {
    this.workerClient = workerClient;
    this.appService = appService;
    this.apiService = apiService;
  }
  setupHandlers() {
    const worker = this.workerClient;

    worker.on('on-error', this.handle_on_error.bind(this));
    worker.on('call-api', this.handle_call_api.bind(this));
    worker.on('notify-plugins-loaded', this.handle_notify_plugins_loaded.bind(this));
    worker.on('request-add-results', this.handle_request_add_results.bind(this));
    worker.on('request-render-preview', this.handle_request_render_preview.bind(this));
  }
  handle_on_error(payload) {
    logger.error(`Unhandled Plugin Error: ${payload}`);
  }
  handle_call_api(__payload) {
    const { moduleName, funcName, payload } = __payload;
    this.apiService.callApi(moduleName, funcName, payload);
  }
  handle_notify_plugins_loaded(payload) {
    this.appService.mainWindow.notifyPluginsLoaded();
  }
  handle_request_add_results(__payload) {
    const { ticket, type, payload } = __payload;
    this.appService.mainWindow.requestAddResults(ticket, type, payload);
  }
  handle_request_render_preview(payload) {
    const { ticket, html } = payload;
    this.appService.mainWindow.requestRenderPreview(ticket, html);
  }
};
