// include gulp
var gulp = require('gulp');

// include plug-ins
var rename = require('gulp-rename');

// JS Build Dependencies
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Style build Dependencies
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var csscomb = require('gulp-csscomb'); // used to sort css props so that it renders fast
var notify = require('gulp-notify');
var gutil = require('gulp-util');

var crypto = require('crypto');
var preprocess = require('gulp-preprocess');

// prod task for compiling less, prefixing and minifiction
gulp.task('less', function () {

    console.log('Hash code in less - ', hash);

    return gulp.src(['./src/less/style.less'])
        .pipe(less({compress: false}).on('error', function(err){
            gutil.log(err);
            this.emit('end');
         }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'not ie < 8', 'ff >= 20', 'last 2 Chrome versions']
         }))
        .pipe(rename('styles.css'))
        .pipe(csscomb())
        .pipe(gulp.dest('./public/css/'))
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(rename('styles-' + hash + '.min.css'))
        .pipe(gulp.dest('./public/css/'))
        .pipe(notify('(PROD)Less Compiled, Prefixed and Minified'));
});

// dev task for compiling less and prefixing (no minification)
gulp.task('devless', function () {

    console.log('Hash code in devless - ', hash);

    return gulp.src(['./src/less/style.less'])
        .pipe(less({compress: false}).on('error', function(err){
            gutil.log(err);
            this.emit('end');
         }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'not ie < 8', 'ff >= 20', 'last 2 Chrome versions']
         }))
        .pipe(rename('styles.css'))
        .pipe(csscomb())
        .pipe(gulp.dest('./public/css/'))
        .pipe(notify('(DEV)Less Compiled, Prefixed and Minified'));
});

// app.js is the client side js which mounts the react app

// prod task to compile and concat js files into a minified bundle
gulp.task('js', function() {

    console.log('Hash code in js - ', hash);

    return  gulp.src(['./src/js/**/*.js'])
           .pipe(concat('main.js'))
           .pipe(gulp.dest('./public/js/'))
           .pipe(uglify())
           .pipe(rename('main-' + hash +'.min.js'))
           .pipe(gulp.dest('./public/js/'))
           .pipe(notify('(PROD)JS modules Transcompiled, Concatenated and Minified'));

});

// dev task to compile and concat js files into a bundle
var devjs = gulp.task('devjs', function() {

    console.log('Hash code in devjs - ', hash);

    return  gulp.src(['./src/js/**/*.js'])
           .pipe(concat('main.js'))
           .pipe(gulp.dest('./public/js/'))
           .pipe(notify('(DEV)JS modules Transcompiled, Concatenated and Minified'));

});

// creates a unique hash hex code that will be used by appended to our dependencies names
var hash = "";
gulp.task('hash', function(){
    // create a unique hash code
    hash = crypto.createHash('sha1').update((new Date().getTime().toString())).digest('hex');
    console.log('Hash code generated - ', hash);
    return hash;
})

// converts handlebars to prod version and also passing the current hash hex code context
gulp.task('hbs', ['hash', 'less', 'js'], function() {

  console.log('Hash code in hbs - ', hash);

  return gulp.src('./views/main.handlebars')
    .pipe(preprocess({
        context: {
            hash : hash
        }
     }))
    .pipe(rename('mainProd.handlebars'))
    .pipe(gulp.dest('./views/'))
    .pipe(notify('(PROD) MainProd hbs file created'));
});

// dev task that watches the files for changes and performs respective tasks
gulp.task('watch', function(){

    gulp.watch('./views/main.handlebars', ['hbs']);
    gulp.watch('./src/less/**/*.less', ['devless']);
    gulp.watch('./src/js/**/*.js', ['devjs']);
})

// prod gulp task which creates respective hbs, js and css files
gulp.task('default', ['hbs'], function() {

});