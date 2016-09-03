---
title: "PreferencesObject"
permalink: /docs/preferences-object/
---

## Methods

### preferences.get(path)
  - `path` String - (optional)

  Returns raw preferences object if path is `undefined`, otherwise it returns the value at path of object, See `path` rules at <https://lodash.com/docs#get>

### preferences.on(eventName, listener)
  - `eventName` String - (**required**)
  - `listener` String - (**required**)
  
  Add a listener to PreferencesObject.  
  Currently, `update` event is supported only. and it will be emitted when plugin preferences has changed.

## Example

```javascript
'use strict'

module.exports = (pluginContext) => {
  const prefObj = pluginContext.preferences;
  let useProxy = false;
  
  function onPrefUpdate(pref) {
    useProxy = pref.useProxy;
  }
  
  function startup() {
    useProxy = prefObj.get('useProxy');
    prefObj.on('update', onPrefUpdate);
  }
  
  function search(query, res) { ... }
  function execute(id, payload) { ... }
  
  return { startup, search, execute };
};
```
