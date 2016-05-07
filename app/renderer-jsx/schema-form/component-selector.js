'use strict';

const lo_isString = require('lodash.isstring');
const componentInfos = [];

function select(schema) {
  for (const componentInfo of componentInfos) {
    const filter = componentInfo.filter;
    const componentClass = componentInfo.componentClass;
    // String matching
    if (lo_isString(filter)) {
      if (filter === schema.type)
        return componentClass;
      continue;
    }
    // Function matching
    if (filter(schema))
      return componentClass;
  }
  return null;
}

function inject(filter, componentClass) {
  componentInfos.push({
    filter,
    componentClass
  });
}

module.exports = {
  select, inject
};
