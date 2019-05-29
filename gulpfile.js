'use strict';

//Сonnection of modules Gulp
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();


const conf = {
   dest: './build'
}

//Paths
const cssFiles = [
   'src/scss/main.scss'

]
const jsFiles = [
   'src/libs/*.js',
   'src/js/main.js'

]

// HTML
function html() {
   return gulp.src('./src/**/*.html')
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());

}

// Style
function styles() {
   return gulp.src(cssFiles)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('all.css'))
      .pipe(autoprefixer({
         browsers: ['> 0.1%'],
         cascade: false
      }))
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(conf.dest + '/css'))
      .pipe(browserSync.stream());

}


// JS
function scripts() {
   return gulp.src(jsFiles)
      .pipe(concat('all.js'))
      .pipe(uglify({
         toplevel: true
      }))
      .pipe(gulp.dest(conf.dest + '/js'))
      .pipe(browserSync.stream());
}
// IMG
function images() {
   return gulp.src('./src/img/**/*')
      .pipe(imagemin([
         pngquant({
            quality: [0.5, 0.5]
         }),
         mozjpeg({
            quality: 50
         })
      ]))

      .pipe(gulp.dest(conf.dest + '/img'))
      .pipe(browserSync.stream());
}

//Сleaning the folder Build
gulp.task('del', () => {
   return del(['build/*'])
});

//Track changes to files
function watch() {
   browserSync.init({
      server: {
         baseDir: "./build/",
         index: "index.html"
      }
   });
   gulp.watch('./src/**/*.html', html);
   gulp.watch('./src/scss/**/*.scss', styles);
   gulp.watch('./src/js/**/*.js', scripts);
   gulp.watch('./src/img/**/*', images);
   gulp.watch('./build/**/*.html').on('change', browserSync.reload);

}
//Gulp Tasks
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);


gulp.task('build', gulp.series('del', gulp.parallel(html, styles, scripts, images)));
gulp.task('default', gulp.series('build', 'watch'));