---
title: "Share your plugins"
permalink: /docs/share-your-plugins/
---
## Some Rules!
In short, you can share your plugin by publishing it on public npmjs registry.  
But there are few rules.

1. You should name your plugin prefixed with `hain-plugin-`, then hpm(hain-package-manager) can find your plugin in npmjs registry.
2. You should add `hain-0.5.0` keyword in your package.json, then hpm can decide api compatibility.

## Publishing
In your plugin directory:

```
npm publish
```

Done.  
You can find your plugin in few seconds if you follow the rules above properly.
