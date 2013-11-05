"use strict";

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                "Gruntfile.js",
                "./*.js"
            ],
            options: {
                jshintrc: ".jshintrc",
            },
        },

        jsbeautifier: {
            files: ["Gruntfile.js", "./*.js"],
            options: {
                config: ".jshintrc",
                js: {
                    jslintHappy: true,
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsbeautifier");


    // By default, lint and run all tests.
    grunt.registerTask("default", ["jsbeautifier", "jshint"]);

};
