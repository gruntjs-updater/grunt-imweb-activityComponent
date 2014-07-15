/*
 * grunt-imweb-activityComponent
 * https://github.com/longyiyiyu/grunt-imweb-activityComponent.git
 *
 * Copyright (c) 2014 lqlongli
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    imweb_activityComponent: {
      main: {
	    options: {
	    },
        files: {
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['imweb_activityComponent']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
