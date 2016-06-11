'use strict';

function send(type, payload) {
  process.send({ type, payload });
}

module.exports = { send };
