'use strict';

const textutil = require('../shared/textutil');
const rpc = require('./rpc-server');

function enqueue(message, duration) {
  rpc.send('mainwindow', 'on-toast', {
    message: textutil.sanitize(message),
    duration
  });
}

module.exports = { enqueue };
