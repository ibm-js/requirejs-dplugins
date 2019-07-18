define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;

	var index = 0;

	function getContextRequire() {
		return requirejs.config({
			//note: BaseUrl is relative to requirejs-dplugins/node_modules/intern/ so baseUrl needs 3 "../"
			//		to be able to access requirejs-dplugins sibling directories.
			baseUrl: "../../..",
			context: "jquery" + index++
		});
	}

	registerSuite("jquery plugin", {
		"basic": function () {
			var dfd = this.async();

			var contextRequire = getContextRequire();

			contextRequire(["requirejs-dplugins/jquery!attributes/classes"], dfd.callback(function ($) {
				var div = document.createElement("div");
				$(div).addClass("foo");
				assert.strictEqual(div.className, "foo");
			}));
		},

		"multiple modules": function () {
			var dfd = this.async();

			var contextRequire = getContextRequire();

			contextRequire(["requirejs-dplugins/jquery!attributes/classes, effects"], dfd.callback(function ($) {
				var div = document.createElement("div");
				$(div).addClass("foo");
				assert.strictEqual(div.className, "foo");
				assert($(div).animate, "animate method defined");
			}));
		}
	});
});
