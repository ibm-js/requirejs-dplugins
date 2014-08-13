# requirejs-dplugins [![Build Status](https://travis-ci.org/ibm-js/requirejs-dplugins.png?branch=master)](https://travis-ci.org/ibm-js/requirejs-dplugins)

Set of AMD plugins for RequireJS. It contains the following plugins:

 * [has](#has)
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

### has
See [docs/has.md](./docs/has.md).

### i18n
See [docs/i18n.md](./docs/has.md).



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

