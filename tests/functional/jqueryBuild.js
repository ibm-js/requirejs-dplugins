define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var pollUntil = require("@theintern/leadfoot/helpers/pollUntil").default;

	registerSuite("jquery plugin build test", {
		before: function () {
			return this.remote
				.get(require.toUrl("requirejs-dplugins/tests/functional/jqueryApp/app.html"))
				.then(pollUntil("return ready || null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		tests: {
			"layer file contains jquery modules": function () {
				this.timeout = intern.config.TEST_TIMEOUT;

				return this.remote
					.findById("result").getVisibleText().then(function (text) {
						assert.strictEqual(text, "works!");
					});
			}
		}
	});
});
