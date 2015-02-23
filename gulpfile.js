var gulp = require('gulp'),
    clean = require('gulp-rimraf'),
    gzip = require('gulp-gzip'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename')

gulp.task('clean', function () {
  return gulp.src(['!dist/.gitignore', 'dist/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean'], function () {
  return gulp.src('src/fields.js')
    .pipe(browserify({standalone: 'Fields'}))
    .pipe(rename('fields.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
    .pipe(gzip());
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
