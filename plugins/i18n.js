/**
 * Plugin based on requirejs i18n
 * see: http://github.com/requirejs/i18n for details
 */
(function () {
    'use strict';

    //regexp for reconstructing the master bundle name from parts of the regexp match
    //nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
    //["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
    //nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
    //["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
    //so, if match[5] is blank, it means this is the top bundle definition.
    var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     * This is not robust in IE for transferring methods that match
     * Object.prototype names, but the uses of mixin here seem unlikely to
     * trigger a problem related to that.
     */
    function mixin(target, source, force) {
        var prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop) && (!target.hasOwnProperty(prop) || force)) {
                target[prop] = source[prop];
            } else if (typeof source[prop] === 'object') {
                if (!target[prop] && source[prop]) {
                    target[prop] = {};
                }
                mixin(target[prop], source[prop], force);
            }
        }
    }

    define(['./i18n/common' /*, './i18n/preload!myapp/nls/src*["fr","ROOT"]'*/ ], function (common) {

        return {
            load: function (name, req, onLoad, config) {
                config = config || {};

                var masterName,
                    match = nlsRegExp.exec(name),
                    prefix = match[1],
                    locale = match[4],
                    suffix = match[5];

                //If match[5] is blank, it means this is the top bundle definition,
                //so it does not have to be handled. Locale-specific requests
                //will have a match[4] value but no match[5]
                if (match[5]) {
                    //locale-specific bundle
                    prefix = match[1];
                    masterName = prefix + suffix;
                } else {
                    //Top-level bundle.
                    masterName = name;
                    suffix = match[4];
                    locale = common.getLocale(config);
                }

                //First, fetch the master bundle, it knows what locales are available.
                req([masterName], function (master) {
                    var getBundleAndMixin = function (prefix, suffix, locale, value) {
                        var mixBundle = function (bundle) {
                            mixin(value, bundle);
                            locale = common.getParentLocale(locale);
                            if (!bundle._flattened && locale) {
                                getBundleAndMixin(prefix, suffix, locale, value);
                            } else {
                                value._flattened = true;
                                onLoad(value);
                                return;
                            }
                        };
                        if (master[locale] === true || master[locale] === 1) {
                            req([prefix + locale + '/' + suffix], mixBundle);
                        } else {
                            // root is on the master bundle or locale is unexisting
                            mixBundle(master[locale] || {});
                        }
                    };

                    getBundleAndMixin(prefix, suffix, locale, {});
                });
            }
        };
    });
}());
