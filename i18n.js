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


		// Build variables
		bundlesList = [],
		confLocalesList,
		mid,
		parentRequire,

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

		eachProp = function (obj, func) {
			var prop;
			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					func(prop, obj[prop]);
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

			var moduleConfig = module.config() || {},
				masterMid,
				layer;

			if (config.isBuild) {
				confLocalesList = config.localesList;
				onLoad();
				return;
			}

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
		},

		writeFile: function (pluginName, moduleName, req, write) {
			mid = mid || pluginName;
			parentRequire = req;
			bundlesList.push(moduleName);
		},

		onLayerEnd: function (write, data) {
			var i18nConf,
				layersContent = {},
				localesList,
				resetPlugin = function () {
					bundlesList = [];
					confLocalesList = undefined;
					mid = undefined;
					parentRequire = undefined;
				};

			if (!data.name) {
				resetPlugin();
				return;
			}

			localesList = confLocalesList;
			if (!localesList) {
				// list all existing locales
				localesList = [];
				bundlesList.forEach(function (bundle) {
					var root = parentRequire(bundle);
					eachProp(root, function (loc) {
						if (localesList.indexOf(loc) < 0) {
							localesList.push(loc);
						}
					});
				});
			}
			if (localesList.indexOf("root") < 0) {
				localesList.push("root");
			}



			// write a nls layer for each locale
			bundlesList.forEach(function (bundle) {
				var name = parseName(bundle),
					root,
					parent,
					availableLocales = [],
					pseudoRoots = {};


				// todo if name.requestedLocale
				// rassembler les eachProp avec au dessus
				root = parentRequire(bundle);
				eachProp(root, function (loc) {
					if (loc !== "root") {
						availableLocales.push(loc);
						parent = common.getParentLocale(loc);
						while (parent && parent !== "root") {
							pseudoRoots[parent] = pseudoRoots[parent] || {};
							pseudoRoots[parent][loc] = true;
							parent = common.getParentLocale(parent);
						}
					}
				});

				localesList.forEach(function (loc) {
					var result = {},
						localizedBundle,
						locale = loc;

					layersContent[loc] = layersContent[loc] || "";

					if (loc !== "root") {
						while (locale && locale !== "root") {
							if (availableLocales.indexOf(locale) >= 0) {
								localizedBundle = parentRequire(name.prefix + locale + "/" + name.suffix);
								mixin(result, localizedBundle);
							}
							locale = common.getParentLocale(locale);
						}
						localizedBundle = root.root === true || root.root === 1 ? parentRequire(name.prefix + "root/" + name.suffix) : root.root;
						mixin(result, localizedBundle);

						result._flattened = true;
						result._pseudoRoot = pseudoRoots[loc] || {};

						layersContent[loc] += 'define("' + name.prefix + loc + "/" + name.suffix + '",' + JSON.stringify(result) + ");";
					} else {
						mixin(result, root);
						result.root = result.root === true || result.root === 1 ? parentRequire(name.prefix + "root/" + name.suffix) : result.root;
						layersContent[loc] += 'define("' + name.prefix + loc + "/" + name.suffix + '",' + JSON.stringify(result) + ");";
					}

				});
			});

			// This assumes nodejs
			eachProp(layersContent, function (loc, content) {
				var fs = require("fs"),
					matchP = data.path.match(/^(.*\/)(.*)(\.js)$/),
					path = matchP[1] + "nls/" + matchP[2] + "_" + loc + ".js",
					parts = path.split("/"),
					tmp = [],
					matchM = data.name.match(/^(.*\/)(.*)$/),
					mid = matchM[1] + "nls/" + matchM[2] + "_" + loc;

				content += "define('" + mid + "', true);";

				// Create path
				parts.pop();
				while (!fs.existsSync(parts.join("/") + "/")) {
					tmp.push(parts.pop());
				}
				while (tmp.length) {
					parts.push(tmp.pop());
					fs.mkdirSync(parts.join("/"));
				}

				fs.writeFileSync(path, content);
			});

			console.log(layersContent);
			console.log(data.name);

			i18nConf = {
				config: {}
			};
			i18nConf.config[mid] = {
				bundlesMap: {},
				localesMap: {}
			};
			i18nConf.config[mid].bundlesMap[data.name] = bundlesList;
			i18nConf.config[mid].localesMap[data.name] = localesList;
			//changer format config pour coller au mail addresser à christophe

			// write i18n config on the layer
			write("require.config(" + JSON.stringify(i18nConf) + ")");

			resetPlugin();
		}
	};
});
