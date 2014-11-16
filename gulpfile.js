var gulp           = require('gulp'),
    $              = require('gulp-load-plugins')(),
    webpack        = require('webpack'),
    bower          = require('bower'),
    mainBowerFiles = require('main-bower-files');

var APP_NAME = "json-interface-builder";

var TS_ROOT     = 'src/typescripts/';
// `typescript` -> JS_ROOT
var JS_ROOT     = 'public/javascripts/src/';
var JS_VENDOR   = 'public/javascripts/vendor/';
// `js-minidy` -> (JS_ROOT + vendor) => JS_MINIFIED_DIR
var JS_MINIFIED = 'public/javascripts/minified/';

// concat all js -> minify (not minified)
gulp.task('minify', [ 'move-vendor-for-bower' ], function () {
  return gulp.src([JS_VENDOR + '**/*.js', JS_ROOT + '**/*.js'])
    .pipe($.changed(JS_MINIFIED))
    .pipe($.plumber())
    .pipe($.concat(APP_NAME + ".js"))
    .pipe($.ngmin()) // for angular
    .pipe($.uglify({
      output: {
        beautify: true
      },
      mangle: false,
      compress: false
    }))
    .pipe(gulp.dest(JS_MINIFIED));
});

// `bower-install` -> move vendor js into vendor dir
gulp.task('move-vendor-for-bower', [], function () {
  return gulp.src(mainBowerFiles())
    .pipe($.changed(JS_VENDOR))
    .pipe(gulp.dest(JS_VENDOR));
});

gulp.task('typescript', function () {
  return gulp.src(TS_ROOT + '**/*.ts')
      .pipe($.changed(JS_ROOT, { extension: '.js' }))
      .pipe($.plumber())
      .pipe($.tsc())
      .pipe(gulp.dest(JS_ROOT));
});

// install libraries through bower
gulp.task('bower-install', function (done) {
  bower.commands.install().on('end', function () { done(); });
});

gulp.task('default', ['watch']);

gulp.task('watch', function () {
  gulp.watch(
    [TS_ROOT + '**/*.ts'],
    ['typescript']
  );
});
