'use strict';

import React from 'react';

const lo_isString = require('lodash.isstring');
const textutil = require('../../main-es6/utils/textutil');

function wrapDescription(description) {
  if (description === undefined)
    return undefined;
  return (<p style={{ color: '#999' }} dangerouslySetInnerHTML={{ __html: textutil.sanitize(description) }}/>);
}

function findErrorMessage(errors, path) {
  const errorPath = `instance${path}`;
  for (const error of errors) {
    if (error.property !== errorPath)
      continue;

    const errorType = error.name;
    const customMessages = error.schema.errorMessages;
    if (customMessages !== undefined) {
      if (lo_isString(customMessages))
        return customMessages;
      if (customMessages[errorType])
        return customMessages[errorType];
    }
    return error.message;
  }
  return undefined;
}

module.exports = {
  wrapDescription,
  findErrorMessage
};
