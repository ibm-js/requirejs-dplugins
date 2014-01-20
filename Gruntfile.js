"use strict";

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				"Gruntfile.js",
				"*.js",
				"i18n/*.js"
			],
			options: {
				jshintrc: ".jshintrc",
			},
		},

		jsbeautifier: {
			files: ["Gruntfile.js", "*.js", "i18n/*.js"],
			options: {
				config: ".jshintrc",
				js: {
					jslintHappy: true,
					indentWithTabs: true
				}
			}
		},

		intern: {
			all: {
				options: {
					runType: 'runner', // defaults to 'client'
					config: 'tests/locale.js',
					reporters: ['console', 'lcov']
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('intern');


	// By default, lint and run all tests.
	grunt.registerTask("default", ["jsbeautifier", "jshint", "intern"]);

};
