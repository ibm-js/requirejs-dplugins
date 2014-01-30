# requirejs-dplugins [![Build Status](https://travis-ci.org/ibm-js/requirejs-dplugins.png?branch=master)](https://travis-ci.org/ibm-js/requirejs-dplugins)

Set of AMD plugins for RequireJS. It contains the following plugins:

 * [i18n](#i18n)
 * [maybe](#maybe)

## Status

No official release yet.
 
## Migration

## Licensing

This project is distributed by the Dojo Foundation and licensed under the ["New" BSD License](./LICENSE).
All contributions require a [Dojo Foundation CLA](http://dojofoundation.org/about/claForm).

## Dependencies

This project requires the following other project to run:

 * requirejs

## Installation

_Bower_ release installation:

    $ bower install requirejs-dplugins

_Manual_ master installation:

    $ git clone git://github.com/ibm-js/requirejs-dplugins.git

Then install dependencies with bower (or manually from github if you prefer to):

	$ cd requirejs-dplugins
	$ bower install

## Documentation
### i18n
This plugin is based on requirejs i18n but modified to support nls built layer.

#### When the application IS NOT optimized
If an application is not built, this plugin will behave exactly like the i18n plugin from RequireJS.
The appropriate documentation can be found on [RequireJS website](http://requirejs.org/docs/api.html#i18n).

#### When the application IS optimized
Once the application is built, the plugin offer three new options:

```
requirejs.config({
    config: {
        i18n: {
            layerOnly: bool,    //default: false
            languagePack: bool, //default: false
            enhanceLayer: bool, //default: true
        }
    }

});
```
 * `layerOnly` (default: false)

    If `layerOnly = true`, the plugin is only looking for nls bundles in built nls layers. `layerOnly` must be true if only the built nls layers are deployed with the application.
    If the individual nls bundles are also deployed, `layerOnly` should be false.

 * `languagePack` (default: false)
    
    If true, this option gives the possibility to add new locales to the application just by adding the corresponding built nls layer. However, this will result in more http requests (and some expected 404 in the console), so it should only be used in low latency environments (like cordova applications).
 * `enhanceLayer` (default: true)

    This option is ignored if `layerOnly = true`.

    This option defines the behaviour of the plugin when a bundle is retrieved from a layer with a less specific locale than requested (ie: bundle `en` from layer when `en-us` was requested).
        
    * If `enhanceLayer = false`, the plugin only uses the bundle from the layer. This is useful when a part of the application is an already built package distributed without the individual nls bundles.
    
    * If `enhanceLayer = true`, the plugin will try to load a more specific individual bundle if one exist.
 


### maybe
This plugin allows to require modules that may or may not exist. If the module is not found it will be `undefined`.


#### Sample usage
```
require(["maybe!a/module/id"], function(module){
    if (module === undefined) {
        //do something when module IS NOT found
    } else {
        //do something else 2when module IS found
    }
});
```


## Credits

* Clément Mathieu (IBM CCLA)

