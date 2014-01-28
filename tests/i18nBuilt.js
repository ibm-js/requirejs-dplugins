define([
	'intern!object',
	'intern/chai!assert',
	'require'
], function (registerSuite, assert, require) {
	var testLayer = function (that, options, locale, layerResult, layerHint, bundleResult, bundleHint) {
		return that.remote
			.get(require.toUrl('./testBuilt.html?' + locale + '&' + options))
			.wait(5000)
			.elementById('layer')
			.text()
			.then(function (txt) {
				assert.strictEqual(txt, layerResult, layerHint);
			})
			.end()
			.elementById('bundle')
			.text()
			.then(function (txt) {
				assert.strictEqual(txt, bundleResult, bundleHint);
			})
			.end();
	};


	registerSuite({
		name: 'i18n',

		// layerOnly - !enhanceLayer - languagePack
		'fr - layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 't&f&t',
				'fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the exact layer',
				'');
		},
		'fr-fr - layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 't&f&t',
				'fr-fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the best layer (ie. fr)',
				'');
		},
		'en - layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 't&f&t',
				'en',
				'En from Layer Bundle A En from Layer Bundle B',
				'The unknown layer en should be used',
				'');
		},
		'it - layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 't&f&t',
				'it',
				'Root Text from Layer Bundle A Root Text from Layer Bundle B',
				'The root layer should be used when a locale does not exist',
				'');
		},

		// layerOnly - !enhanceLayer - !languagePack
		'fr - layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 't&f&f',
				'fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the exact layer',
				'');
		},
		'fr-fr - layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 't&f&f',
				'fr-fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the best layer (ie. fr)',
				'');
		},
		'en - layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 't&f&f',
				'en',
				'Root Text from Layer Bundle A Root Text from Layer Bundle B',
				'The en layer should not be discovered',
				'');
		},
		'it - layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 't&f&f',
				'it',
				'Root Text from Layer Bundle A Root Text from Layer Bundle B',
				'The root layer should be used when a locale does not exist',
				'');
		},

		// !layerOnly - !enhanceLayer - !languagePack
		'fr - !layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 'f&f&f',
				'fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the exact layer',
				'Fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'fr-fr - !layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 'f&f&f',
				'fr-fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The layer should not be enhanced',
				'Fr-fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'en - !layerOnly - !enhanceLayer - !languagePack': function () {
			return testLayer(this, 'f&f&f',
				'en',
				'Root Text from Layer Bundle A Root Text from Layer Bundle B',
				'The layer en should not be found',
				'Root Text from Bundle C Root Text from Bundle D',
				'The best match should be found');
		},

		// !layerOnly - enhanceLayer - !languagePack
		'fr - !layerOnly - enhanceLayer - !languagePack': function () {
			return testLayer(this, 'f&t&f',
				'fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the exact layer',
				'Fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'fr-fr - !layerOnly - enhanceLayer - !languagePack': function () {
			return testLayer(this, 'f&t&f',
				'fr-fr',
				'Fr-fr from Bundle A Fr from Layer Bundle B',
				'The layer should be enhanced',
				'Fr-fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'en - !layerOnly - enhanceLayer - !languagePack': function () {
			return testLayer(this, 'f&t&f',
				'en',
				'Root Text from Layer Bundle A Root Text from Layer Bundle B',
				'The layer en should not be found',
				'Root Text from Bundle C Root Text from Bundle D',
				'The best match should be found');
		},

		// !layerOnly - !enhanceLayer - languagePack
		'fr - !layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 'f&f&t',
				'fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the exact layer',
				'Fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'fr-fr - !layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 'f&f&t',
				'fr-fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The layer should not be enhanced',
				'Fr-fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'en - !layerOnly - !enhanceLayer - languagePack': function () {
			return testLayer(this, 'f&f&t',
				'en',
				'En from Layer Bundle A En from Layer Bundle B',
				'The layer en should not be found',
				'Root Text from Bundle C Root Text from Bundle D',
				'The best match should be found');
		},

		// !layerOnly - enhanceLayer - languagePack
		'fr - !layerOnly - enhanceLayer - languagePack': function () {
			return testLayer(this, 'f&t&t',
				'fr',
				'Fr from Layer Bundle A Fr from Layer Bundle B',
				'The text should come from the exact layer',
				'Fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'fr-fr - !layerOnly - enhanceLayer - languagePack': function () {
			return testLayer(this, 'f&t&t',
				'fr-fr',
				'Fr-fr from Bundle A Fr from Layer Bundle B',
				'The layer should be enhanced',
				'Fr-fr from Bundle C Fr from Bundle D',
				'The best match should be found');
		},
		'en - !layerOnly - enhanceLayer - languagePack': function () {
			return testLayer(this, 'f&t&t',
				'en',
				'En from Layer Bundle A En from Layer Bundle B',
				'The layer en should not be found',
				'Root Text from Bundle C Root Text from Bundle D',
				'The best match should be found');
		},

	});
});
