# PluginContext.App
App object has following functions:
* **restart()**
 
  Restart the app
  
* **quit()**

  Quit the app

* **open(query)**
  - `query` String - Query text (optional, default is `undefined`)

  Open the window with new Query

* **close(dontRestoreFocus)**
  - `dontRestoreFocus` Boolean - if true, Hain doesn't focus previous focused window (optional, default is `false`)

  Close the window
  
* **setQuery(query)**
  - `query` String - Query text (**required**)

  Change query (similar with `redirect` property in `SearchResult`)
  
* **openPreferences(prefId)**
  - `prefId` String - Opening Preferences Id (PackageName for Plugin) (optional, default is `undefined`)

  Open preferences window

**Example**
```javascript
'use strict'

module.exports = (pluginContext) => {
  const app = pluginContext.app;
  
  function startup() { ... }
  function search(query, res) { ... }
  
  function execute(id, payload) {
    if ( ... ) {
      app.restart();
    }
  }
  
  return { startup, search, execute };
};
```

## Related Docs
* [PluginContext](plugin-context.md)

