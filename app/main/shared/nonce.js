'use strict';

const fs = require('fs');
const path = require('path');

const cryptoUtil = require('../../utils/crypto-util');
const conf = require('../conf');

let nonce = 'what';

function ensurePermanentNonce() {
  const nonceFilePath = path.join(conf.APP_PREF_DIR, 'nonce');
  const isExists = fs.existsSync(nonceFilePath);
  if (isExists) {
    nonce = fs.readFileSync(nonceFilePath, { encoding: 'utf8' });
  } else {
    nonce = cryptoUtil.generateKey();
    fs.writeFileSync(nonceFilePath, nonce, { encoding: 'utf8' });
  }
}

ensurePermanentNonce();

module.exports = nonce;
