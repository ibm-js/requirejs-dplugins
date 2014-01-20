require.config({
	config: {
		"i18n": {
			bundlesMap: {
				"myapp/nls/bundleA": "myapp/nls/test",
				"myapp/nls/bundleB": "myapp/nls/test"
			},
			localesMap: {
				"myapp/nls/test": {
					fr: true,
					root: true
				}
			}
		}
	}
});

define("myapp/test", [
	"i18n!myapp/nls/bundleA",
	"i18n!myapp/nls/bundleB"
], function (bundleA, bundleB) {
	return {
		log: function (element) {
			element.innerHTML = bundleA.MSG + " " + bundleB.MSG;
		}
	};
});
