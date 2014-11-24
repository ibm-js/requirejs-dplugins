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

	grunt.registerTask("testBuild", "Run the builds used by the functional tests", function (target) {
		var done = this.async();

		var appRootDir = "tests/functional/jqueryApp"

		function npmInstall(error, bowerResults) {
			if (error !== null) {
				grunt.log.writeln(bowerResults.stdout);
				done(error);
				return;
			}
			grunt.util.spawn({
				cmd: "npm",
				args: ["install"],
				opts: {
					cwd: appRootDir
				}
			}, startBuild);
		}

		function startBuild(error, npmResults) {
			if (error !== null) {
				grunt.log.writeln(npmResults.stdout);
				done(error);
				return;
			}
			grunt.util.spawn({
				cmd: "grunt",
				args: ["build"],
				opts: {
					cwd: appRootDir
				}
			}, done.bind(null, true));
		}

		grunt.util.spawn({
			cmd: "bower",
			args: ["install"],
			opts: {
				cwd: appRootDir
			}
		}, npmInstall);
	});

	// Testing.
	// Always specify the target e.g. grunt test:remote, grunt test:remote
	// then add on any other flags afterwards e.g. console, lcovhtml.
	var testTaskDescription = "Run this task instead of the intern task directly! \n" +
		"Always specify the test target e.g. \n" +
		"grunt test:local\n" +
		"grunt test:remote\n\n" +
		"Add any optional reporters via a flag e.g. \n" +
		"grunt test:local:console\n" +
		"grunt test:local:lcovhtml\n" +
		"grunt test:local:console:lcovhtml";
	grunt.registerTask("test", testTaskDescription, function (target) {
		function addReporter(reporter) {
			var property = "intern." + target + ".options.reporters",
				value = grunt.config.get(property);
			if (value.indexOf(reporter) !== -1) {
				return;
			}
			value.push(reporter);
			grunt.config.set(property, value);
		}

		if (this.flags.lcovhtml) {
			addReporter("lcovhtml");
		}

		if (this.flags.console) {
			addReporter("console");
		}

		grunt.task.run("testBuild");
		grunt.task.run("intern:" + target);
	});

};
