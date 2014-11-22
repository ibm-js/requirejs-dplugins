"use strict";

module.exports = function (grunt) {
	var filesList = [
		"*.js",
		"*.json",
		"i18n/*.js",
		"tests/*.js"
	];


	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: filesList,
			options: {
				jshintrc: ".jshintrc"
			}
		},

		lineending: {
			all: {
				options: {
					eol: "crlf",
					overwrite: true
				},
				files: {
					"": filesList
				}
			}
		},

		jsbeautifier: {
			files: filesList,
			options: {
				config: ".jshintrc",
				js: {
					jslintHappy: true,
					indentWithTabs: true
				}
			}
		},

		intern: {
			remote: {
				options: {
					runType: "runner",
					config: "tests/intern",
					reporters: ["runner"]
				}
			},
			local: {
				options: {
					runType: "runner", // defaults to "client"
					config: "tests/intern.local",
					reporters: ["runner"]
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks("grunt-lineending");
	grunt.loadNpmTasks("intern");


	// By default, lint and run all tests.
	grunt.registerTask("default", ["jsbeautifier", "lineending", "jshint", "intern:remote"]);

	// Just lint
	grunt.registerTask("lint", ["jsbeautifier", "lineending", "jshint"]);

	// Travis build
	grunt.registerTask("travis", ["jshint", "intern:remote"]);

};
