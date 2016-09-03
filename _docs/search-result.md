---
title: "SearchResult"
permalink: /docs/search-result/
---
SearchResult is a plain object format which has a following properties:

* `id` Any - An identifier (recommend to be unique), used as argument of `execute` function (optional, default is `undefined`)
* `payload` Any - Extra information, used as a argument of `execute` function (optional, default is `undefined`) 
* `title` String or Object - Title text, See [Text Format](/docs/text-format/)(**required**)
* `desc` String or Object - Description text, See [Text Format](/docs/text-format/) (**required**)
* `icon` String - Icon URL, See [Icon URL Format](/docs/icon-url-format/) (optional, default is `icon` of package.json)
* `redirect` String - Redirection query (optional, default is `undefined`)
* `group` String - Result group name (optional, default is `group` of package.json)
* `preview` Boolean - whether it has HTML Preview (optional, default is `false`)

  
SearchResult object is used as a argument for [ResponseObject](/docs/response-object/) object.  
You can send SearchResult using Response object,

## Example

```javascript
function search(query, res) { // res is a Response object
  const searchResult = {
    id: 'identifier',
    payload: {},
    title: 'Hello, World',
    desc: 'Goodbye',
    group: 'Hello'
  };
  res.add(searchResult);
}
```
