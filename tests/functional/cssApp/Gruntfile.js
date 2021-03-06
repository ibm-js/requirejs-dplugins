// Gruntfile for building layer including src.js
module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-amd-build");

	var outprop = "amdoutput";
	var outdir = "./build/";
	// use a depth of 4 directory to keep tmpdir/../../.. inside a tmp directory
	var tmpdir = "./tmp/tmp/tmp/tmp";

	grunt.initConfig({
		amdloader: {
			baseUrl: ".",

			paths: {
				"requirejs-dplugins": "../../.."
			}
		},

		amdbuild: {
			dir: tmpdir,

			// List of layers to build.
			layers: [
				// Test build.
				{
					name: "app",
					include: [
						// Modules and layers listed here, and their dependencies, will be added to the layer.
						"src"
					]
				}
			]
		},

		// Config to allow to concatenate files to generate the layer.
		concat: {
			options: {
				banner: "<%= " + outprop + ".header%>",
				sourceMap: true
			},
			dist: {
				src: "<%= " + outprop + ".modules.abs %>",
				dest: outdir + "<%= " + outprop + ".layerPath %>"
			}
		},

		copy: {
			plugins: {
				expand: true,
				cwd: tmpdir,
				src: "<%= " + outprop + ".plugins.rel %>",
				dest: outdir
			}
		},

		clean: {
			out: [outdir],
			temp: [tmpdir]
		}
	});

	grunt.registerTask("amdbuild", function (amdloader) {
		var name = this.name, layers = grunt.config(name).layers;
		layers.forEach(function (layer) {
			grunt.task.run("amddepsscan:" + layer.name + ":" + name + ":" + amdloader);
			grunt.task.run("amdserialize:" + layer.name + ":" + name + ":" + amdloader + ":" + outprop);
			grunt.task.run("concat");
			grunt.task.run("copy:plugins");
		});
	});
	grunt.registerTask("build", [
		"clean:out",
		"clean:temp",
		"amdbuild:amdloader"
	]);
};