define(["module", "./i18n/common"], function (module, common) {
    return {
        load: function (name, req, onLoad, config) {
            config = config || {};

            var moduleLayer = name,
                parts = name.split('/'),
                bundleName = parts.pop(),
                nlsLayer = parts.join('/') + "/nls/" + bundleName,
                locale = common.getLocale(config),
                flattenedLocales = module.config().locales;

            while (locale) {
                if (flattenedLocales.indexOf(locale) >= 0) {
                    req([nlsLayer + "_" + locale], function () {
                        //need to wait for the nls layer before loading the module layer
                        req([moduleLayer], function () {
                            onLoad(1);
                        });
                    });
                }
                locale = common.getParentLocale(locale);
            }
        }
    };
});
