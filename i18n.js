/**
 * Plugin based on requirejs i18n
 * see: http://github.com/requirejs/i18n for details
 */
define(['./i18n/common', "module"], function (common, module) {

	// regexp for reconstructing the master bundle name from parts of the regexp match
	// nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
	// ["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
	// nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
	// ["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
	// so, if match[5] is blank, it means this is the top bundle definition.
	var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/,


		// Simple function to mix in properties from source into target,
		// but only if target does not already have a property of the same name.
		// This is not robust in IE for transferring methods that match
		// Object.prototype names, but the uses of mixin here seem unlikely to
		// trigger a problem related to that.
		mixin = function (target, source, force) {
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
		},

		// Use nlsRegExp to parse the resource mid and return a usable object.	
		parseName = function (name) {
			var match = nlsRegExp.exec(name);

			// If match[5] is blank, it means this is the top bundle definition,
			// hence suffix is match[4] and locale is null.
			return {
				prefix: match[1],
				masterLocale: "root",
				requestedLocale: match[5] ? match[4] : null,
				suffix: match[5] || match[4]
			};
		},

		getMasterMid = function (name) {
			return name.masterLocale === "root" ? name.prefix + name.suffix :
				name.prefix + name.masterLocale + "/" + name.suffix;
		},


		// Transform a bundle from a language layer to a root bundle.
		rootify = function (bundle, locale) {
			var result = {};
			if (bundle._pseudoRoot) {
				result[locale] = {};
				mixin(result, bundle._pseudoRoot);
				delete bundle._pseudoRoot;
				mixin(result[locale], bundle);
				bundle = result;
			}
			return bundle;
		},

		// Construct the best language bundle by merging from most specific locale to less specific locale.
		resolveAMD = function (name, req, onLoad) {
			var masterMid = getMasterMid(name);

			//First, fetch the master bundle, it knows what locales are available.
			req([masterMid], function (master) {
				var getBundleAndMixin = function (prefix, suffix, locale, value) {
					var mixBundle = function (bundle) {
						mixin(value, bundle);
						locale = common.getParentLocale(locale);
						if (!bundle._flattened && locale) {
							getBundleAndMixin(prefix, suffix, locale, value);
						} else {
							value._flattened = true;
							onLoad(value);
						}
					};

					if (master[locale] === true || master[locale] === 1) {
						req([prefix + locale + '/' + suffix], mixBundle);
					} else {
						// locale is on the master bundle or locale is unexisting
						mixBundle(master[locale] || {});
					}
				};

				master = rootify(master, name.masterLocale);
				getBundleAndMixin(name.prefix, name.suffix, name.requestedLocale, {});
			});
		},

		getLayer = function (name, layer, moduleConfig, getParentLocale, req, onLoad) {
			var locale = name.requestedLocale,
				localesMap = moduleConfig.localesMap[layer];

			while (locale && !localesMap[locale]) {
				locale = getParentLocale(locale);
			}

			if (locale) {
				name.masterLocale = locale;

				req([layer + "_" + locale], function () {
					pickFromLayer(name, moduleConfig, req, onLoad);
				});
			} else {
				console.log("i18n: no relevant layer " + layer + " found for locale " + name.requestedLocale + ".");
				onLoad();
			}
		},


		tryLayer = function (name, layer, moduleConfig, getParentLocale, req, onLoad) {
			var helper = function (locale) {
				if (locale) {
					req(["maybe!" + layer + "_" + locale], function (bundle) {
						if (bundle) {
							name.masterLocale = locale;
							pickFromLayer(name, moduleConfig, req, onLoad);
						} else {
							helper(getParentLocale(locale));
						}
					});
				} else {
					console.log("i18n: no relevant layer " + layer + " found for locale " + name.requestedLocale + ".");
					onLoad();
				}
			};

			helper(name.requestedLocale);
		},

		pickFromLayer = function (name, moduleConfig, req, onLoad) {
			var masterMid = getMasterMid(name);

			if (name.requestedLocale === name.masterLocale || moduleConfig.layerOnly || !moduleConfig.enhanceLayer) {
				req([masterMid], function (bundle) {
					if (bundle.root) {
						bundle = bundle.root;
					}
					onLoad(bundle);
				});
			} else {
				resolveAMD(name, req, onLoad);
			}
		};

	return {
		load: function (name, req, onLoad, config) {
			config = config || {};

			var moduleConfig = module.config(),
				masterMid,
				layer;

			moduleConfig.enhanceLayer = moduleConfig.enhanceLayer === undefined ? true : moduleConfig.enhanceLayer;
				
			// Parse name and set the locale if a top level bundle is required
			name = parseName(name);
			name.requestedLocale = name.requestedLocale || common.getLocale(moduleConfig.locale || config.locale);
			masterMid = getMasterMid(name);

			// If there is no layer, classic AMD mode
			if (!moduleConfig.bundlesMap) {
				resolveAMD(name, req, onLoad);
				return;
			}

			// From now on there is at least one layer available

			// Check if requested module is in a layer
			layer = moduleConfig.bundlesMap[masterMid];
			if (!layer && moduleConfig.layerOnly) {
				console.log("i18n: module " + masterMid + " not found in layer.");
				onLoad();
				return;
			} else if (!layer) {
				resolveAMD(name, req, onLoad);
				return;
			}

			// The module is in a layer

			if (moduleConfig.languagePack) {
				// Drop language pack mode, hence need to try every possible layer
				tryLayer(name, layer, moduleConfig, common.getParentLocale, req, onLoad);
				return;
			} else {
				// There is a locale list for the layer
				getLayer(name, layer, moduleConfig, common.getParentLocale, req, onLoad);
				return;
			}
		}
	};
});
