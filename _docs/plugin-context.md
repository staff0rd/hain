---
title: "PluginContext"
permalink: /docs/plugin-context/
---

## Properties  

### Environment Variables    
- `MAIN_PLUGIN_REPO` String  
- `DEV_PLUGIN_REPO` String  
- `INTERNAL_PLUGIN_REPO` String  
- `__PLUGIN_PREINSTALL_DIR` String  
- `__PLUGIN_PREUNINSTALL_FILE` String  
- `CURRENT_API_VERSION` String  
- `COMPATIBLE_API_VERSIONS` Array&lt;String&gt;  

### Utilities  
- `app` [PluginContext.App]({{ site.baseurl }}/docs/plugin-context-app/) - Provides functions to control the app  
- `clipboard` [PluginContext.Clipboard]({{ site.baseurl }}/docs/plugin-context-clipboard/) - Provides electron's clipboard API  
- `toast` [PluginContext.Toast]({{ site.baseurl }}/docs/plugin-context-toast/) - Provides toast API  
- `shell` [PluginContext.Shell]({{ site.baseurl }}/docs/plugin-context-shell/) - Provides electron's shell API  
- `logger` [PluginContext.Logger]({{ site.baseurl }}/docs/plugin-context-logger/) - Provides logging API  
- `localStorage` [node-persist Object](https://github.com/simonlast/node-persist) - Provides a storage for each plugins  

### Preference Objects  
- `globalPreferences` [PreferencesObject]({{ site.baseurl }}/docs/preferences-object/) - Contains Global preferences  
- `preferences` [PreferencesObject]({{ site.baseurl }}/docs/preferences-object/) - Contains Plugin's own preferences  


## Example  

```javascript
'use strict';

module.exports = (pluginContext) => {
  const app = pluginContext.app;
  const toast = pluginContext.toast;
  const logger = pluginContext.logger;
  
  function startup() { ... }
  
  function search(query, res) { ... }
  
  function execute(id, payload) {
    if (id === '1') {
      toast.enqueue('This is message', 1500);
    } else if (id == '2') {
      app.close();
    } else if (id == '3') {
      logger.log('this is log');
    }
  }
  
  return { startup, search, execute };
};
```
