define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var pollUntil = require("@theintern/leadfoot/helpers/pollUntil").default;

	registerSuite("css plugin build test", {
		before: function () {
			return this.remote
				.get(require.toUrl("requirejs-dplugins/tests/functional/cssApp/app.html"))
				.then(pollUntil("return ready || null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		tests: {
			"css style application": function () {
				this.timeout = intern.config.TEST_TIMEOUT;

				return this.remote
					.findById("result").getComputedStyle("borderLeftStyle").then(function (style) {
						assert.strictEqual(style, "dashed");
					}).getComputedStyle("backgroundImage").then(function (style) {
						var match = style.match(/(build\/resources\/test\.png)["']?\)?;?$/);
						assert.strictEqual(match[1], "build/resources/test.png");
					});
			}
		}
	});
});
