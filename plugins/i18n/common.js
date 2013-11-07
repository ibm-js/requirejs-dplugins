define(["../maybe!./parentLocales"], function (parentLocales) {
    parentLocales = parentLocales || {};

    return {
        getLocale: function (config) {
            var locale = config.locale;
            if (!locale) {
                locale = typeof navigator === "undefined" ? "root" :
                    (navigator.language ||
                    navigator.userLanguage || "root");
            }
            // just to be extra-sure
            return locale.toLowerCase();
        },

        getParentLocale: function (loc) {
            if (!loc || loc === "root") {
                return undefined;
            }
            if (parentLocales[loc]) {
                return parentLocales[loc];
            }

            var parts = loc.split("-");
            parts.pop();
            return (parts.length > 0) ? parts.join("-") : "root";
        }
    };
});
