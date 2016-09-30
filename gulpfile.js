var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var header = require('gulp-header');
var license = '/*\n' +
		' * Project: vTimer\n' +
		' * Description: Configurable event-based jQuery timer\n' +
		' * Author: https://github.com/Wancieho\n' +
		' * License: MIT\n' +
		' * Version: 0.0.3\n' +
		' * Dependancies: jquery-1.*\n' +
		' * Date: 10/02/2016\n' +
		' */\n';

gulp.task('default', [
	'copy',
	'minify'
]);

gulp.task('copy', function () {
	return gulp.src('source/jquery.vtimer.js')
			.pipe(strip())
			.pipe(header(license))
			.pipe(gulp.dest('dist'));
});

gulp.task('minify', function () {
	return gulp.src('source/jquery.vtimer.js')
			.pipe(uglify())
			.pipe(header(license))
			.pipe(rename('jquery.vtimer.min.js'))
			.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('source/jquery.vtimer.js', ['copy']);
	gulp.watch('source/jquery.vtimer.js', ['minify']);
});