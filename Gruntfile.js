"use strict";

module.exports = function (grunt) {
	var filesList = [
		"*.js",
		"*.json",
		"!package-lock.json",
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

		// Run Intern from grunt while still using the intern.json file.
		// There are many ways to do this, so I just picked one.
		// Note though that the grunt intern task does not automatically load intern.json.
		run: {
			"intern-local": {
				cmd: "npx",
				args: ["intern"],
				options: {
					failOnError: true
				}
			},

			"intern-remote": {
				cmd: "npx",
				args: ["intern", "config=@sauce"],
				options: {
					failOnError: true
				}
			}
		},

		clean: {
			// Delete files created by the "testBuild" target.
			testBuild: [
				"tests/functional/cssApp/{bower_components,node_modules,build,tmp}"
			]
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks("grunt-lineending");
	grunt.loadNpmTasks("grunt-run");

	// By default, lint and run all tests.
	grunt.registerTask("default", ["jshint", "test:remote"]);

	// Just lint
	grunt.registerTask("lint", ["jshint"]);

	// Travis build
	grunt.registerTask("travis", ["jshint", "test:remote"]);

	grunt.registerTask("testBuild", "Run the build used by the functional test", function (test) {
		var done = this.async();

		var appRootDir = "tests/functional/" + test + "App";

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
			}, finish);
		}

		function finish(error, buildResults) {
			if (error !== null) {
				grunt.log.writeln(buildResults.stdout);
				done(error);
				return;
			}
			done(true);
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
	// Always specify the target e.g. grunt test:remote, grunt test:remote.
	// For more control, run testBuild:css manually, then
	// directly call "npx intern".
	var testTaskDescription = "Run this task instead of the intern task directly! \n" +
		"Always specify the test target e.g. \n" +
		"grunt test:local\n" +
		"grunt test:remote";
	grunt.registerTask("test", testTaskDescription, function (target) {
		// First create the test builds. These are referenced from the intern tests.
		grunt.task.run("testBuild:css");

		// Then run the intern tests.
		grunt.task.run("run:intern-" + target);

		// Finally, delete the test builds so that they don't show up in "git status" as "untracked files".
		grunt.task.run("clean:testBuild");
	});

};
