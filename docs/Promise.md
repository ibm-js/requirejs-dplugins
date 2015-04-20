---
layout: doc
title: requirejs-dplugins/Promise
---

# requirejs-dplugins/Promise!

`requirejs-dplugins/Promise` provides an ES6 Promise implementation. If the browser does not provide it, the
plugin will load the [lie](https://github.com/calvinmetcalf/lie) implementation.

If RequireJS `baseUrl` is not the `bower_components` directory, the path to the `lie` directory should be set
using RequireJS `paths` configuration.

## Sample
```
require(["requirejs-dplugins/Promise!"], function(Promise){
	var promise = new Promise(function (resolve, reject) {
		...
	});
});
```
