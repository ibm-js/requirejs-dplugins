/**
 * Promise plugin.
 *
 * This plugin will return an ES6 compliant Promise implementation. This implementation come from the browser
 * if one is available or from the lie package.
 *
 * @example:
 *      To create a promise:
 *      ```
 *      require(["requirejs-dplugins/Promise!"], function (Promise){
 *         var promise = new Promise(function (resolve, reject) {
 *             ...
 *         });
 *      });
 *      ```
 *
 * @module requirejs-dplugins/Promise
 */
/* global Promise */
define({
	load: function (name, req, onload, config) {
		config = config || {};
		if (config.isBuild) {
			onload();
		} else if (typeof Promise === "function") {
			onload(Promise);
		} else {
			// use global require to allow map configuration.
			require(["lie/dist/lie"], function (lie) {
				onload(lie);
			});
		}
	}
});