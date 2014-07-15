/*
 * grunt-imweb-activityComponent
 * https://github.com/longyiyiyu/grunt-imweb-activityComponent.git
 *
 * Copyright (c) 2014 lqlongli
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('imweb_activityComponent', 'A grunt plugin for activity component', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			conf: 'test/config.json',
			srcPath: 'src',
			desPath: 'des'
		});
		var te = require('imweb-tpl-engine');
		var conf = grunt.file.readJSON(options.conf);
		var desPath = options.desPath + '/' + conf.codeRootDir;

		var fileObj = {
			expand: true,
			cwd: options.srcPath,
			src: ['**'],
			dest: desPath
		}
		grunt.config.set('copy.ac.files', fileObj);
		grunt.task.run('copy:ac');

		for (var i = 0, len = conf.modifyList.length; i < len; ++i) {
			var srcpath = options.srcPath + '/' + conf.modifyList[i],
				despath = desPath + '/' + conf.modifyList[i];
			grunt.file.write(despath, te.getTpl(te.addTpl(grunt.file.read(srcpath)), conf));
		}

		//修改雪碧图设置
//	  var spriteConfPath =
		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			// Concat specified files.
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				// Read file source.
				return grunt.file.read(filepath);
			}).join(grunt.util.normalizelf(options.separator));

			// Handle options.
			src += options.punctuation;

			// Write the destination file.
			grunt.file.write(f.dest, src);

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

};
