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
			desPath: 'des',
			spriteConfPath: 'proj-task/sprite/conf.json',
			gruntConfPath: 'Gruntfile.js',
			fixFrom: ['src/inline']
		});
		var te = require('imweb-tpl-engine');
		var fs = require('fs');
		var conf = grunt.file.readJSON(options.conf);
		var desPath = options.desPath + '/' + conf.codeRootDir;

		if (this.target == 'before') {
			var cfileObj = {
				expand: true,
				cwd: options.srcPath,
				src: ['**'],
				dest: desPath
			}
			grunt.config.set('copy.ac.files', [cfileObj]);
			grunt.config.set('clean.ac', [desPath]);
			grunt.task.run(['clean:ac', 'copy:ac','imweb_activityComponent:after']);
			return;
		}

		//修改活动项目需要修改的文件
		for (var i = 0, len = conf.modifyList.length; i < len; ++i) {
			var srcpath = options.srcPath + '/' + conf.modifyList[i],
				despath = desPath + '/' + conf.modifyList[i];
			grunt.file.write(despath, te.getTpl(te.addTpl(grunt.file.read(srcpath)), conf));
		}

		//修改雪碧图设置
		try{
			var spriteConfStr=fs.readFileSync(options.spriteConfPath,{encoding:"utf8"}), spriterConf;

			if(spriteConfStr){
				var stripJson=require("strip-json-comments");
				var beautify = require('js-beautify');
				spriteConfStr=stripJson(spriteConfStr);
				spriterConf=JSON.parse(spriteConfStr);
				spriterConf.input.cssSource.push('dist/activity/'+conf.codeRootDir+'/css/*.css');
				spriterConf.output.cssDist.push('dist/activity/'+conf.codeRootDir+'/css');
				grunt.file.write(options.spriteConfPath, beautify(JSON.stringify(spriterConf), {
					"jslint_happy": true
				}));
			}
		}catch(ex){
			console.log(ex);
			console.log(spriteConfStr);
			console.log("read conf file error!");
		}

		//修改report的from值
		options.fixFrom.push(desPath);
		for (var i = 0, len = options.fixFrom.length; i < len; ++i) {
			grunt.file.recurse(options.fixFrom[i], function(abspath, rootdir, subdir, filename) {
				//跳过img文件夹
				if (subdir == 'img') return;
				grunt.file.write(abspath, grunt.file.read(abspath).replace(/from=\d+/g, 'from='+conf.report.from));
			});
		}
	});
};
