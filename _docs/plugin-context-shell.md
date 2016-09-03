---
title: "PluginContext.Shell"
permalink: /docs/plugin-context-shell/
---

## Methods

### shell.openItemInFolder(fullPath)  
  - `fullPath` String - (**required**)  
  
  Show the given file in a file manager.  

### shell.openItem(fullPath)  
  - `fullPath` String - (**required**)  

  Open the given file in the desktop's default manner.

### shell.openExternal(fullPath)  
  - `fullPath` String - (**required**)  

  Open the given external protocol URL in the desktop's default manner.

## Example

```javascript
'use strict'

module.exports = (pluginContext) => {
  const shell = pluginContext.shell;
  
  function startup() { ... }
  function search(query, res) { ... }
  
  function execute(id, payload) {
    if ( ... ) {
      shell.openExternal('https://www.google.com/');
    }
  }
  
  return { startup, search, execute };
};
```
