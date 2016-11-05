"use strict"

const gulp = require('gulp'),
	_if = require('gulp-if'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	less = require('gulp-less'),
	lesshint = require('gulp-lesshint'),
	cleanCSS = require('gulp-clean-css'),
	del = require('del'),
	eslint = require('gulp-eslint'), 
	plumber = require('gulp-plumber'),
	watch = require('gulp-watch'),
	debug = require('gulp-debug'),
	browserSync = require('browser-sync').create();

const env = process.env.NODE_ENV || 'development',
	production = env === 'production';

gulp.task('lint:less', function() {
	return gulp.src('src/less/*')
		.pipe(lesshint())
		.pipe(lesshint.reporter());
});

gulp.task('lint:js', function(cb) {
	// TODO: doesn't work for now
	return gulp.src('src/js/*.js')
		.pipe(debug())
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('lint', gulp.parallel('lint:js', 'lint:less'));

gulp.task('js', function() {
	return gulp.src("src/js/*")
		.pipe(_if(!production, plumber()))
		.pipe(_if(!production, sourcemaps.init()))
		.pipe(gulp.dest("dist/js"))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(_if(!production, sourcemaps.write()))
		.pipe(gulp.dest("dist/js"));
});

gulp.task('styles', function() {
	return gulp.src('src/less/*.less')
		.pipe(gulp.dest('dist/less'))
		.pipe(_if(!production, plumber(function(err) {
			console.log(err);
			this.emit('end');
		})))
		.pipe(_if(!production, sourcemaps.init()))
		.pipe(less())
		.pipe(_if(!production, sourcemaps.write()))
		.pipe(debug())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())
		.pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('dist/css'))
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('watch', function() {
	gulp.watch('src/js/*.js', gulp.series('js'));
	gulp.watch('src/less/*.less', gulp.series('styles'));
});

gulp.task('sync', function() {
	browserSync.init({
		proxy: '127.0.0.1:8080/holy-grail'
	});	
	//browserSync.watch('dist/css/*.*').on('change', browserSync.stream);
	browserSync.watch('dist/js/*.*').on('change', browserSync.reload);
});

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('js', 'styles'))
);

gulp.task('default', gulp.series(
	'build',
	gulp.parallel('watch', 'sync'))
);

