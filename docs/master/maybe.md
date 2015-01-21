---
layout: default
title: requirejs-dplugins/maybe
---

# requirejs-dplugins/maybe

`requirejs-dplugins/maybe` allows to require modules that may or may not exist.
If the module is not found, there is an expected 404 in the console and the module will be `undefined`.

## Sample
```
require(["requirejs-dplugins/maybe!a/module/id"], function(module){
    if (module === undefined) {
        //do something when module IS NOT found
    } else {
        //do something else when module IS found
    }
});
```
