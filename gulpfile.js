'use strict'

const pkgJson = require('./package.json')
  
const autoprefixer = require('gulp-autoprefixer'),  
  del = require('del'),
  dotenv = require('dotenv'),
  gulp = require('gulp'),
  path = require('path'),
  rename = require('gulp-rename'),
  rtlcss = require('gulp-rtlcss'),
  sass = require('gulp-sass')
  



const envArgs = dotenv.config({
  path:path.resolve(process.cwd(),'./.config/.env'),
  encoding:'utf8'
})

if(envArgs.error){
  throw envArgs.error
}

mergeEnv()


function mergeEnv(envArgs){

}


var ProPaths = {
  SRC:"src",
  ASSETS:"public",
  BUILD:"build",
  DEST:"dist"
}

var imagePreOpts = {

}


/* ================== Scss ================= */

gulp.task('build:scss',createScssBuildTask({
  src:`${ProPaths.SRC}/scss/main.scss`,
  dest:`${ProPaths.DEST}/css`,
  devMode:false
}))

function createScssBuildTask({src,dest,devMode,pattern}) {
  return function() {
    if(devMode){
      //
    }
    return  buildScss()
  }

  function buildScssWithSourceMaps() {

  }

  function buildScss(){
    return gulp.src(src)
      .pipe(sass().on('error',sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest(dest))
      .pipe(rtlcss())
      .pipe(rename({suffix:'-rtl'}))
      .pipe(gulp.dest(dest))
  }
}