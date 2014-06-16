/* global moduleRequire:true, pluginRequire:true, testGlobal:true */
define([
	"intern!object",
	"intern/chai!assert"
], function (registerSuite, assert) {

	registerSuite({
		name: "has - module",
		setup: function () {
			moduleRequire = require.config({
				context: "module",
				baseUrl: "../../",
				config: {
					has: {
						"config-feature": true,
						"config-feature2": false
					}
				}
			});
		},
		beforeEach: function () {},
		"Cache setup from config": function () {
			var dfd = this.async();

			moduleRequire(["has"], dfd.callback(function (has) {
				assert.isTrue(has.cache["config-feature"], "import feature from config");
				assert.isFalse(has.cache["config-feature2"], "import feature from config");
				assert.isUndefined(has.cache["undefined feature"], "import feature from config");
			}));
		},
		"has function": function () {
			var dfd = this.async();

			moduleRequire(["has"], dfd.callback(function (has) {
				assert.isTrue(has("config-feature"), "import feature from config");
				assert.isFalse(has("config-feature2"), "import feature from config");
				assert.isUndefined(has("undefined feature"), "import feature from config");
			}));
		},
		"add feature": function () {
			var dfd = this.async();

			moduleRequire(["has"], dfd.callback(function (has) {
				has.add("add-feature", function () {
					return true;
				});
				has.add("add-feature2", function () {
					return false;
				});
				assert.isTrue(has("add-feature"), "added a true feature.");
				assert.isFalse(has("add-feature2"), "added a false feature");
			}));
		},
		"add feature, lazy evaluation": function () {
			var dfd = this.async();

			moduleRequire(["has"], dfd.callback(function (has) {
				testGlobal = false;
				has.add("lazy-feature", function (global) {
					return global.testGlobal;
				});
				has.add("lazy-feature2", function (global) {
					return global.testGlobal;
				}, true);
				testGlobal = true;

				assert.isTrue(has("lazy-feature"),
					"should be true as the test function should be lazily evaluated.");
				assert.isFalse(has("lazy-feature2"),
					"should be false as the test function should be evaluated immediately.");
			}));
		},
		"add feature, force": function () {
			var dfd = this.async();

			moduleRequire(["has"], dfd.callback(function (has) {
				has.add("config-feature", function () {
					return false;
				}, false, true);
				has.add("config-feature", function () {
					return true;
				}, false);

				has.add("config-feature2", function () {
					return true;
				}, true, true);
				has.add("config-feature2", function () {
					return false;
				}, true);

				assert.isFalse(has("config-feature"), "should be erased by false");
				assert.isTrue(has("config-feature2"), "should be erased by true");
			}));
		}
	});

	registerSuite({
		name: "has - plugin",
		setup: function () {
			pluginRequire = require.config({
				context: "plugin",
				baseUrl: "../../",
				packages: [{
					name: "modules",
					location: "tests/testModules/"
				}],
				config: {
					has: {
						"config-feature": true,
						"config-feature2": false
					}
				}
			});
		},
		"basic load": function () {
			var dfd = this.async();

			pluginRequire([
				"has!config-feature?modules/module1:modules/module2",
				"has!config-feature2?modules/module1:modules/module2"
			], dfd.callback(function (module1, module2) {
				assert.strictEqual(module1.msg, "module 1",
					"config-feature is true so has should resolve to module1");
				assert.strictEqual(module2.msg, "module 2",
					"config-feature2 is false so has should resolve to module2");
			}));
		},
		"ternary variation": function () {
			var dfd = this.async();

			pluginRequire([
				"has!config-feature?modules/module1",
				"has!config-feature?:modules/module2",
				"has!config-feature2?modules/module1",
				"has!config-feature2?:modules/module2"
			], dfd.callback(function (module1, undefined2, undefined1, module2) {
				assert.strictEqual(module1.msg, "module 1",
					"config-feature is true so has should resolve to module1");
				assert.strictEqual(module2.msg, "module 2",
					"config-feature2 is false so has should resolve to module2");
				assert.isUndefined(undefined2);
				assert.isUndefined(undefined1);
			}));
		},
		"chained ternary": function () {
			var dfd = this.async();

			pluginRequire([
				"has!config-feature?modules/module1:config-feature2?modules/module2:modules/module3",
				"has!config-feature2?modules/module1:config-feature?modules/module2:modules/module3",
				"has!config-feature2?modules/module1:config-feature2?modules/module2:modules/module3"
			], dfd.callback(function (module1, module2, module3) {
				assert.strictEqual(module1.msg, "module 1");
				assert.strictEqual(module2.msg, "module 2");
				assert.strictEqual(module3.msg, "module 3");
			}));
		},
		"undefined feature": function () {
			var dfd = this.async();

			pluginRequire([
				"has!undef-feature?modules/module1:modules/module2"
			], dfd.callback(function (module2) {
				assert.strictEqual(module2.msg, "module 2");
			}));
		},
		"normalization": function () {
			var dfd = this.async();

			pluginRequire([
				"has!config-feature?./tests/testModules/module1",
				"has!config-feature?./tests/testModules/plugin!./resources!test"
			], dfd.callback(function (module1, plugin) {
				assert.strictEqual(module1.msg, "module 1");
				assert.strictEqual(plugin.res, "./resources!test");
			}));
		}

	});
});
