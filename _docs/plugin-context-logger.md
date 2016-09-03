---
title: "PluginContext.Logger"
permalink: /docs/plugin-context-logger/
---
You can use this object instead of `console.log`.  

## Methods  

### logger.log(message)  
  - `message` Any - message (**required**)  

  Logs your messages.  

>**Note**  
>You can see logging messages in `Chrome Developer Tools` in the app.  
>You can open `Chrome Developer Tools` by pressing <kbd>F12</kbd> in the app.  
>and you can also see these logging messages in console (standard output) too.

**Example**

```javascript
'use strict';

module.exports = (pluginContext) => {
  const logger = pluginContext.logger;
  
  function startup() {
    logger.log('startup');
  }
  function search(query, res) { ... }
  
  function execute(id, payload) {
    if (...) {
      logger.log('something is being executed');
    }
  }
  
  return { startup, search, execute };
};
```
