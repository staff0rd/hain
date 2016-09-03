---
title: "ResponseObject"

---

## Methods

### res.add(result)  
  - `result` [SearchResult]({{ site.baseurl }}/docs/search-result/)  
  
### res.add(results)  
  - `results` Array\<[SearchResult]({{ site.baseurl }}/docs/search-result/)\>  

  You can add your [SearchResult]({{ site.baseurl }}/docs/search-result/) to ResultList in the app by calling this function
  
### res.remove(id)  
  - `id` Any - identifier of a [SearchResult]({{ site.baseurl }}/docs/search-result/) to be removed  

  You can remove a [SearchResult]({{ site.baseurl }}/docs/search-result/) that you did add using the identifier.
    

You can use it for sending(adding) or removing SearchResults.
and it is always provided as second argument of `search(query, res)` function.

> **Note**  
> All function calls will be ignored when user has changed input. 

## Example
  
```javascript
function search(query, res) {
  res.add({
    id: 'temp',
    title: 'Fetching...',
    desc: 'Please wait a second'
  });
  setTimeout(() => res.remove('temp'), 1000);
}
```
