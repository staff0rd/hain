'use strict';

const components = {};

function select(type) {
  return components[type];
}

function inject(type, componentClass) {
  components[type] = componentClass;
}

module.exports = {
  select, inject
};
