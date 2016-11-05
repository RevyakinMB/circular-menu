"use strict"

const gulp = require('gulp');
const env = process.env.NODE_ENV || 'development',
	production = env === 'production';

const gulpTask = function(taskName, path, options) {
	options = options || {};
	options.taskName = taskName;

	gulp.task(taskName, function(callback) {
		var task = require(path).call(this, options);
		return task(callback);
	});
}

gulpTask('lint:less', './tasks/lint-less.js', {
	src: 'src/less/*.less'
});

gulpTask('lint:js', './tasks/lint-js.js', {
	src: 'src/js/*.js',
	cacheFilePath: process.cwd() + '/tmp/lintCache.json'
});

gulp.task('lint', gulp.parallel('lint:js', 'lint:less'));

gulpTask('js', './tasks/js.js', {
	src: 'src/js/*.js',
	dest: 'dist/js'
});

gulpTask('styles', './tasks/styles.js', {
	src: 'src/less/*.less',
	dest: {
		less: 'dist/less',
		css: 'dist/css'
	}
});

gulpTask('clean', './tasks/clean.js', {
	dir: 'dist'
});

gulp.task('watch', function() {
	gulp.watch('src/js/*.js', gulp.series('js'));
	gulp.watch('src/less/*.less', gulp.series('styles'));
});

gulpTask('sync', './tasks/sync.js', {
	dir: 'dist/js/*.js',
	proxy: '127.0.0.1:8080/holy-grail'
});

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('js', 'styles'))
);

gulp.task('default', gulp.series(
	'build',
	gulp.parallel('watch', 'sync'))
);

