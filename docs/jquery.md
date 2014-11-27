---
layout: default
title: requirejs-dplugins/jquery
---

# requirejs-dplugins/jquery!


This plugin will load load the specified jQuery module(s), unless the application has loaded the whole jQuery
library via a `<script>` tag, in which case it just returns a pointer to the already loaded jQuery.

It's useful to avoid loading jQuery twice.


## Example

To get a jQuery object that can modify classes and do animations:

```js
require(["requirejs-dplugins/jquery!attributes/classes,effects"], function ($) {
    ...
    $(myNode).addClass("selected");
    $(myNode).animate(...);
});
```
