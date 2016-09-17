var gulp = require('gulp')
var bs = require('browser-sync').create()
var del = require('del')
var fs = require('fs')

// scss
var sass = require('gulp-sass')
var rucksack = require('gulp-rucksack')
var autoprefixer = require('gulp-autoprefixer')
var sourcemaps = require('gulp-sourcemaps')

// js
var browserify = require('browserify')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var gutil = require('gulp-util')
var babelify = require("babelify")

//metalsmith
var metalsmith = require('gulp-metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var inPlace = require('metalsmith-in-place')
var permalinks = require('metalsmith-permalinks')

var src = {
  scss: 'scss/**/*.scss',
  css: 'build/css/',
  src: 'src/**/*.**',
  layouts: 'layouts/**/*.**',
  components: 'components/**/*.**',
  js: 'js/**/*.js',
  ignore: '!node_modules/**'
}

gulp.task('default', ['serve'])

gulp.task('metalsmith', ['clean'], function() {
  return gulp.src(src.src)
    .pipe(metalsmith({
      root: __dirname,
      metadata: {
        siteTitle: "Metalsmith",
        siteDescription: "Awesome Static Site"
      },
      use: [
        markdown(),
        permalinks({
          relative: false
        }),
        layouts({
          engine: 'handlebars',
          default: 'page.html',
          partials: "components"
        }),
        inPlace({
          engine: 'handlebars'
        }),
      ]
    }))
    .pipe(gulp.dest('./build'))
})

gulp.task('serve', ['metalsmith', 'sass', 'scripts'], function() {

  bs.init({
    open: false,
    server: 'build'
  })

  gulp.watch(src.scss, ['sass'])
  gulp.watch(src.js, ['scripts'])
  gulp.watch([src.src, src.layouts, src.components, src.ignore], ['metalsmith'])
  gulp.watch(['build/**', '!build/css/**']).on('change', bs.reload)
})

gulp.task('sass', function() {
  return gulp.src(src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
      })
      .on('error', function(err) {
        bs.notify(err.message, 3000)
        this.emit('end')
      }))
    .pipe(autoprefixer({
      browsers: ['> 1% in AU']
    }))
    .pipe(rucksack())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(src.css))
    .pipe(bs.stream({
      match: '**/*.css'
    }))
})

gulp.task('scripts', function() {
  var b = browserify({
    entries: './js/main.js',
    debug: true,
    sourceMaps: true
  }).transform("babelify", {presets: ["es2015"]})
  return b.bundle()
    .on('error', function(err) {
      bs.notify(err.message, 3000)
      this.emit('end')
    })
    .pipe(source('./js/main.js'))
    .pipe(rename('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/js'))
})

gulp.task('clean', function() {
  del(['build/**', '!build', '!build/css/**', '!build/js/**'])
})

gulp.task('clean-hard', function() {
  del(['build/**'])
})

gulp.task('build', ['clean-hard', 'sass', 'scripts', 'metalsmith'])
