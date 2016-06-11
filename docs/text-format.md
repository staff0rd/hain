# Text Format
Basically, all texts used in Hain is restricted HTML.  
You can use tags like:
* \<b\>Bold\</b\>
* \<i\>Italic\</i\>
* \<u\>Underline\</u\>
* \<em\>Emphasized\</em\>
* \<span\>Span with style\</span\>

You should carefully use these tags to avoid breaking layout.

and you can use a string for text or a object for text with options.

**Available Options**
* `singleLine` Boolean - Display as Single line
* `text` String - Text

**Example**
```javascript
function search(query, res) {
  res.add({
    title: '<b>Bold</b> text',
    desc: '<span style="color: blue">blue</span> text'
  });
}
```
- with Options
```javascript
function search(query, res) {
  res.add({
    title: {
      singleLine: true,
      text: '<b>Title</b>'
    }
  });
}
```