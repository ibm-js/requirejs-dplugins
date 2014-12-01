# requirejs-dplugins [![Build Status](https://travis-ci.org/ibm-js/requirejs-dplugins.png?branch=master)](https://travis-ci.org/ibm-js/requirejs-dplugins)

Set of AMD plugins for RequireJS. It contains the following plugins:

 * [css](#css)
 * [has](#has)
 * [i18n](#i18n)
 * [jquery](#jquery)
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
    $ bower install jquery (if you are using the jquery plugin)

_Manual_ master installation:

    $ git clone git://github.com/ibm-js/requirejs-dplugins.git

Then install dependencies with bower (or manually from github if you prefer to):

	$ cd requirejs-dplugins
	$ bower install


## css
This plugin will load and wait for a css file. CSS loaded with this plugin can be overwritten by
user-defined style sheet, using `<link>` or `<style>` tag.

See [docs/css.md](./docs/css.md) for documentation.

## has
This plugin provides an extensible API to manage feature detection. It also implements the
[requirejs plugin api](http://requirejs.org/docs/plugins.html) to provide conditional module loading.

See [docs/has.md](./docs/has.md) and [samples/has.html](./samples/has.html) for documentation and sample.

## i18n
This plugin provides provides an API to handle string translation.

See [docs/i18n.md](./docs/i18n.md) and [samples/i18n.html](./samples/i18n.html) for documentation and sample.

## jquery
This plugin loads the specified jquery modules if they are not loaded already.

See [docs/jquery.md](./docs/jquery.md) for documentation.

## maybe
This plugin allows to require modules that may or may not exist.

See [docs/maybe.md](./docs/maybe.md) and [samples/maybe.html](./samples/maybe.html) for documentation and sample.
