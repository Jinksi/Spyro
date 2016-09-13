var gulp = require('gulp')
var bs = require('browser-sync').create()
var sass = require('gulp-sass')
var rucksack = require('gulp-rucksack')
var autoprefixer = require('gulp-autoprefixer')
var sourcemaps = require('gulp-sourcemaps')
var del = require('del')
var fs = require('fs')

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
        permalinks(),
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

// Static Server + watching scss/php files
gulp.task('serve', ['metalsmith', 'sass'], function() {

  bs.init({
    open: false,
    server: 'build'
  })

  gulp.watch(src.scss, ['sass'])
  gulp.watch([src.src, src.js, src.layouts, src.components, src.ignore], ['metalsmith'])
  gulp.watch(['build/**', '!build/css/**']).on('change', bs.reload)
})

// Compile sass into CSS
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

gulp.task('clean', function() {
  del(['build/**', '!build', '!build/css/**'])
})
gulp.task('clean-hard', function() {
  del(['build/**'])
})
