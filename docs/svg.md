---
layout: doc
title: requirejs-dplugins/svg
---

# requirejs-dplugins/svg!

This plugin load svg graphics and declares them in one sprite. This sprite is automatically added to your DOM, so that you can reference included graphics in a `<use>` tag.

## Example

```js
define([
    "requirejs-dplugins/svg!./icon1.svg",
    "requirejs-dplugins/svg!./icon2.svg"
], function(id1, id2){
	// id1 === "icon1" and id2 === "icon2"
})
```

This will fetch `icon1.svg` and `icon2.svg` and add two symbols to the sprite.
```svg
<svg>
	...
	<symbol id="icon1" viewBox="..." > ... </symbol>
	<symbol id="icon2" viewBox="..." > ... </symbol>
</svg>
```

You can then use the icons anytime only with

```
<svg>
	<use xlink:href="#icon1"></use>
</svg>
```

If the first `<svg>` tag of your graphic holds an `id` attribute, this id will be used as the reference. Otherwise, the name of the file is used.

## Build
The build step will merge all graphics in one sprite beforehand and save the result in a `<layer>.svg`. 
When running the built version, this sprite is fetched as soon as one of the graphic inside is required.


## Creating graphics that work well with this plugin 

To work properly, your graphic should include a `viewBox` attribute. The `id` is optional. 
As an example, here is the minimal markup your graphic should include:

```svg
<svg id="my-graphic" viewBox="0 0 80 120"> ... </svg>
```

