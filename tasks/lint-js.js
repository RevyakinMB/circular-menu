const gulp = require('gulp'),
	  eslint = require('gulp-eslint'),
	  fs = require('fs'),
	  _if = require('gulp-if'),
	  through2 = require('through2').obj,
	  combiner = require('stream-combiner2').obj;

module.exports = function(options) {
	return function() {
		const cacheFilePath = process.cwd() + '/tmp/lintCache.json';
		let eslintResults = {};
		try {
			eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
		} catch(e) {
			//console.log("error", e);
		}

		let rcMtime = undefined;
		gulp.src(options.eslintrcPath, {read: false})
			.pipe(through2(function(file, enc, cb) {
				rcMtime = file.stat.mtime;
				cb();
			}));

		return gulp.src('src/js/*.js', {read: false})
			.pipe(_if(
				function(file) {
					let cached = eslintResults[file.path];
					return cached &&
						cached.mtime === file.stat.mtime.toJSON() &&
						cached.mtime > rcMtime;
				},
				through2(function(file, enc, callback) {
					file.eslint = eslintResults[file.path].eslint;
					callback(undefined, file);
				}),
				combiner(
					// TODO: try it async
					through2(function(file, enc, callback) {
						file.contents = fs.readFileSync(file.path);
						callback(undefined, file);
					}),
					eslint(),
					through2(function(file, enc, callback) {
						eslintResults[file.path] = {
							eslint: file.eslint,
							mtime: file.stat.mtime
						}
						callback(undefined, file);
					})
				)
			))
			.pipe(eslint.format())
			.on('end', function() {
				fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
			});
	};
};
