define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;

	registerSuite("Promise plugin", {
		"promise support": function () {
			var dfd = this.async(1000);

			requirejs(["requirejs-dplugins/Promise!"], function (Promise) {
				new Promise(function (resolve) {
					setTimeout(resolve, 50);
				}).then(function () {
					dfd.resolve(true);
				});
			});
		}
	});
});
