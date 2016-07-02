'use strict';

const sanitizeHtml = require('sanitize-html');
const lo_isString = require('lodash.isstring');
const lo_assign = require('lodash.assign');

function _sanitizeHtml(text) {
  return sanitizeHtml(text, {
    allowedTags: ['a', 'b', 'i', 'u', 'em', 'strong', 'span'],
    allowedAttributes: {
      'a': ['href'],
      'i': ['class'],
      'span': ['class', 'style']
    }
  });
}

function sanitize(txtObj) {
  if (txtObj === undefined)
    return undefined;
  if (lo_isString(txtObj))
    return _sanitizeHtml(txtObj);
  return lo_assign(txtObj, {
    text: _sanitizeHtml(txtObj.text)
  });
}

module.exports = { sanitize };
