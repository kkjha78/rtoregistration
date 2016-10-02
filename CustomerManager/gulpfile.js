﻿var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    templateCache = require('gulp-angular-templatecache'),
    //sass = require('gulp-sass'),
    //csso = require('gulp-csso'),
    dist = 'Scripts/dist';

//gulp.task('sass', function () {
//    gulp.src('Content/styles.scss')
//        .pipe(plumber())
//        .pipe(sass({ errLogToConsole: true }))
//        .pipe(csso())
//        .pipe(gulp.dest('Content'));
//});

gulp.task('compressScripts', function () {
    gulp.src([
        'app/**/*.js'
    ])
        .pipe(plumber())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist));
});

gulp.task('templates', function () {
    gulp.src('app/vehiclesApp/views/**/*.html')
        .pipe(plumber())
        .pipe(templateCache({ root: 'app/vehiclesApp/views', module: 'vehiclesApp' }))
        .pipe(gulp.dest(dist));
});

gulp.task('watch', function () {

    //gulp.watch('Content/*.scss', ['sass']);

    gulp.watch(['app/**/*.js'],
        ['compressScripts']);

});

gulp.task('default', ['compressScripts', 'templates', 'watch']);
