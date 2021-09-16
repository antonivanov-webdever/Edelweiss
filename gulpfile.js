/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const plumber = require('gulp-plumber');
const rigger = require('gulp-rigger');
const imagemin = require('gulp-imagemin');
const svgstore = require("gulp-svgstore");

// Compile .pug files (pretty .html on the output)
function pugCompileDev(done) {
  gulp
    .src('src/views/pages/*.pug')
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest('build/'))
    .on('end', browserSync.reload);

  done();
}

// Compile .pug files for production
function pugCompileProd(done) {
  gulp
    .src('src/views/pages/*.pug')
    .pipe(plumber())
    .pipe(
      pug({
        pretty: false,
      })
    )
    .pipe(gulp.dest('build/'))
    .on('end', browserSync.reload);

  done();
}

// Compile .sass & .scss files with mapping & pretty on the output
function sassDev(done) {
  gulp
    .src('src/styles/styles.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errorLogToConsole: true,
      })
    )
    .on('error', console.error.bind(console))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/styles/'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );

  done();
}

// Compile .sass & .scss compressed files for production
function sassProd(done) {
  gulp
    .src('src/styles/styles.scss')
    .pipe(plumber())
    .pipe(
      sass({
        errorLogToConsole: true,
        outputStyle: 'compressed',
      })
    )
    .on('error', console.error.bind(console))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/styles/'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );

  done();
}

// Compile .js files with mapping
function scriptsDev(done) {
  gulp
    .src('src/scripts/main.js')
    .pipe(plumber())
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/scripts/'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );

  done();
}

// Compile .js compressed files for production
function scriptsProd(done) {
  gulp
    .src('src/scripts/main.js')
    .pipe(plumber())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/scripts/'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );

  done();
}

// Move images into the build folder
function imagesDev(done) {
  gulp
    .src('src/images/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('build/images/'))
    .pipe(browserSync.stream());

  done();
}

// Move optimized images into the build folder for production
function imagesProd(done) {
  gulp
    .src('src/images/**/*')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('build/images/'))
    .pipe(browserSync.stream());

  done();
}

function icons(done) {
	gulp
    .src('src/sprite/**/*.svg')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/images/'))
    .pipe(browserSync.stream())
  done();
}

// Move all necessary assets into the build folder
function resources(done) {
  gulp
    .src('src/resources/**/*')
    .pipe(gulp.dest('build/'))
    .on('end', browserSync.reload);

  done();
}

// Clean the build folder
function clean() {
  return del('build/**/*', { force: true });
}

/*
  Primary tasks
*/

function watch() {
  gulp.watch('src/**/*.pug', pugCompileDev);
  gulp.watch('src/styles/**/*.scss', sassDev);
  gulp.watch('src/scripts/**/*.js', scriptsDev);
  gulp.watch('src/resources/**/*', resources);
  gulp.watch('src/images/**/*', imagesDev);
  gulp.watch('src/sprite/**/*', icons);
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: 'build',
    },
    host: 'localhost',
    port: 9000,
  });

  done();
}

// Default task for development
gulp.task('default',
  gulp.series(
    resources,
    imagesDev,
    icons,
    gulp.parallel(pugCompileDev, scriptsDev),
    sassDev,
    gulp.parallel(watch, serve)
  )
);

// Task to build for production
gulp.task('build',
  gulp.series(
    clean,
    gulp.series(
      resources,
      imagesProd,
      pugCompileProd,
      scriptsProd,
      sassProd
    )
  )
);

// Clean build directory
gulp.task(clean);
