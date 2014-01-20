define(["./common"], function (common) {
	return {
		load: function (name, req, onLoad, config) {
			config = config || {};

			var locale = common.getLocale(config),
				parts = name.split("*"),
				flattenedLocales = JSON.parse(parts[1]);

			name = parts[0];
			while (locale) {
				if (flattenedLocales.indexOf(locale) >= 0) {
					req([name + "_" + locale], function (bundle) {
						onLoad(bundle);
						return;
					});
				}
				locale = common.getParentLocale(locale);
			}
		}
	};
});
