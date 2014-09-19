var gulp = require('gulp'),
    clean = require('gulp-rimraf'),
    gzip = require('gulp-gzip'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename')

gulp.task('update', ['clean', 'build']);

gulp.task('clean', function () {
  return gulp.src(['!dist/.gitignore', 'dist/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('build', function () {
  return gulp.src('src/fields.js')
    .pipe(browserify({standalone: 'Fields'}))
    .pipe(rename('fields.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
    .pipe(gzip());
});

gulp.task('test', ['build'], function (done) {
  var spawn = require('child_process').spawn;
  var proc = spawn('./node_modules/karma/bin/karma',
    ['start', 'karma.conf.js', '--single-run'],
    {stdio: "inherit"}
  );
  proc.on('exit', done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['update']);
});

gulp.task('default', ['watch', 'update']);
