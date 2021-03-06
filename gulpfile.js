'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
gulp.task('js:lint', function() {
  return gulp.src(['./ng-local-storage-service.js', './gulpfile.js', './tests.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('fail'));
});
gulp.task('js:test', function() {
  var mochaPhantom = require('gulp-mocha-phantomjs');
  return gulp.src('./test.html')
    .pipe(mochaPhantom());
});
gulp.task('default', ['js:lint', 'js:test']);
