---
title: "PluginContext.App"
permalink: /docs/plugin-context-app/
---
## Methods

### app.restart()
 
  Restart the app
  
### app.quit()

  Quit the app

### app.open(query)
  - `query` String - Query text (optional)

  Open the window with new Query

### app.close(dontRestoreFocus)
  - `dontRestoreFocus` Boolean - if true, Hain doesn't focus previous focused window (optional, default is `false`)

  Close the window
  
### app.setQuery(query)
  - `query` String - Query text (**required**)

  Change query (similar with `redirect` property in `SearchResult`)
  
### app.openPreferences(prefId)
  - `prefId` String - Opening Preferences Id (PackageName for Plugin) (optional)

  Open preferences window

## Example

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
