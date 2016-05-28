'use strict';

const lo_assign = require('lodash.assign');
const lo_isPlainObject = require('lodash.isplainobject');

function extractText(text) {
  if (!lo_isPlainObject(text))
    return text;
  return text.text;
}

function extractTextStyle(text, extraStyle) {
  if (!lo_isPlainObject(text))
    return lo_assign({}, extraStyle);
  const singleLineStyle = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
  let style = lo_assign({}, extraStyle);
  if (text.singleLine)
    style = lo_assign(style, singleLineStyle);
  return style;
}

module.exports = {
  extractText,
  extractTextStyle
};
