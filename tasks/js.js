const gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	_if = require('gulp-if');

const env = process.env.NODE_ENV || 'development', 
	production = env === 'production'; 

module.exports = function(options) {
	return function() {
	    return gulp.src(options.src)
			.pipe(_if(!production, $.plumber()))
			.pipe(_if(!production, $.sourcemaps.init()))
			.pipe(gulp.dest(options.dest))
			.pipe($.uglify())
			.pipe($.rename({ extname: '.min.js' }))
			.pipe(_if(!production, $.sourcemaps.write()))
			.pipe(gulp.dest(options.dest));
	};
}; 
