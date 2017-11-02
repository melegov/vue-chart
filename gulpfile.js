var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var server = require('gulp-server-livereload');
var gulpSequence = require('gulp-sequence');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

gulp.task('html', function(){
    return gulp.src(['./src/**/*.pug', '!./src/_*/**'])
        .pipe(pug())
        .pipe(gulp.dest('build'))
});

// свои стили не пригодились
gulp.task('css', function(){
    return gulp.src('src/styles/**/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css'))
});

gulp.task('js', function() {
    return gulp.src('src/**/*.js')
        .pipe(gulp.dest('build'));
});

gulp.task('data', function() {
    return gulp.src('src/data/*.json')
        .pipe(gulp.dest('build/data'));
});

gulp.task('watcher', function () {
    watch('./src/**/*.pug', batch(function(events, done) {
        gulp.start('html', done);
    }));
    watch('src/styles/**/*.less', batch(function(events, done) {
        gulp.start('css', done);
    }));
    watch('src/**/*.js', batch(function(events, done) {
        gulp.start('js', done);
    }));
});

gulp.task('webserver', ['watcher'], function() {
    gulp.src('build')
        .pipe(server({
            path: 'build',
            livereload: true,
            open: true
        }));
});

gulp.task('default', gulpSequence( ['html', 'css', 'data', 'js'], 'webserver' ));
