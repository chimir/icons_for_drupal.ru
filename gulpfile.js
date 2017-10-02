'use strict';

var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var run = require('run-sequence');
var del = require('del');

gulp.task('sprite', ['sprite:fa', 'sprite:md'], function() {
  return gulp.src('build/icons/**/*.svg')
    .pipe(rename(function (path) {
      var name = path.dirname.split('/');
      name.push(path.basename);
      path.basename = name.join('-').replace(/-svg/g, '');
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/sprites'))
});

gulp.task('inject-svg', function () {
  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  return gulp.src('build/index.html')
    .pipe(inject(gulp.src(['build/sprites/sprite.svg']), { transform: fileContents }))
    .pipe(gulp.dest('build'));
});

gulp.task('sprite:fa', function() {
  return gulp.src('build/icons/fa-svg/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('fa-sprite.svg'))
    .pipe(gulp.dest('build/sprites'));
});

gulp.task('sprite:md', function() {
  return gulp.src('build/icons/md-svg/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('md-sprite.svg'))
    .pipe(gulp.dest('build/sprites'));
});

gulp.task('icons', function() {
  return gulp.src('icons/**/*.svg')
    .pipe(svgmin({
      plugins: [{
        removeTitle: true
      }]
    }))
    .pipe(gulp.dest('build/icons'));
});

gulp.task('copy', function() {
  return gulp.src([
    '*.html',
    '*.css'
  ])
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'icons',
    'sprite',
    'inject-svg',
    fn
  );
});


