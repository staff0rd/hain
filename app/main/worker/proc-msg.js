'use strict';

function send(channel, payload) {
  process.send({ channel, payload });
}

module.exports = { send };
