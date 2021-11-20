'use strict';
//Import modules
const gulp = require('gulp');
const concatCss = require('gulp-concat-css');
const clean = require('gulp-clean');
const path = require('path');

const publicDirectory = path.resolve("public/");
const cssDirectory = path.join(publicDirectory, "css/");

const concatenatedStylesheet = "styles.css";

//Export "clean-css" task to wipe the concatenated stylesheet,
// if exists (and fail silently if not)
gulp.task('clean-css', function() {
  return gulp.src(path.join(cssDirectory, concatenatedStylesheet), {read: false, allowEmpty: true})
    .pipe(clean({force: true}));
});

//
gulp.task('concatenate-css', gulp.series('clean-css', function() {
  return gulp.src(path.join(cssDirectory, "**/*.css"))
    .pipe(concatCss(concatenatedStylesheet))
    .pipe(gulp.dest(cssDirectory));
}));
