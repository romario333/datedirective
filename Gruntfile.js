'use strict';

module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    base: 'app',
                    keepalive: true,
                    open: true
                }
            }
        },
        karma: {
            test: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            'test-debug': {
                configFile: 'karma.conf.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'app/**/*.js',
                '!app/bower_components/**'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('test', ['karma:test']);
    grunt.registerTask('test:debug', ['karma:test-debug']);

};