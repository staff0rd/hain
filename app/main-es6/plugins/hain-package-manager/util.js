'use strict';

const lo_isString = require('lodash.isstring');

function hasCompatibleAPIKeywords(apiVersions, keywords) {
  for (const keyword of keywords) {
    if (apiVersions.indexOf(keyword) >= 0)
      return true;
  }
  return false;
}

function parseAuthor(author) {
  if (lo_isString(author))
    return author;
  return author.name;
}

module.exports = { hasCompatibleAPIKeywords, parseAuthor };
