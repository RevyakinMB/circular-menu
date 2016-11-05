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

	browserSync = require('browser-sync').create(),

	through2 = require('through2').obj,
	combiner = require('stream-combiner2').obj,
	fs = require('fs');

const env = process.env.NODE_ENV || 'development',
	production = env === 'production';

gulp.task('lint:less', function() {
	return gulp.src('src/less/*')
		.pipe(lesshint())
		.pipe(lesshint.reporter());
});

gulp.task('lint:js', function(cb) {
	const cacheFilePath = process.cwd() + '/tmp/lintCache.json';
	let eslintResults = {};
	try {
		eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
	} catch(e) {
		//console.log("error", e);
	}

	return gulp.src('src/js/*.js', {read: false})
		.pipe(debug({title: "src"}))
		.pipe(_if(
			function(file) {
				var cached = eslintResults[file.path];
				return cached && cached.mtime === file.stat.mtime.toJSON();
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
				debug({title: "eslint"}),
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

