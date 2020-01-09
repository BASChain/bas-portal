'use strict'

const pkgJson = require('./package.json')

const assign = require('lodash.assign'),
  autoprefixer = require('gulp-autoprefixer'),
  //babelify = require('babelify'),
  //brfs = require('brfs'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  DateFormat = require('fast-date-format'),
  del = require('del'),
  dotenv = require('dotenv'),
  envify = require('envify/custom'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jsoneditor = require('gulp-json-editor'),
  livereload = require('gulp-livereload'),
  path = require('path'),
  pify = require('pify'),
  rename = require('gulp-rename'),
  rtlcss = require('gulp-rtlcss'),
  sass = require('gulp-sass'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  terser = require('gulp-terser-js'),
  watch = require('gulp-watch'),
  watchify = require('watchify')

const endOfStream = pify(require('end-of-stream'))


var dateFormat = new DateFormat('YYDDDD')
const isPreRelease = true

const liveOpts = {
  port:58415
}

if(isPreRelease){
  dateFormat = new DateFormat('MMDDDD_HHmm')
}
const envArgs = dotenv.config({
  path:path.resolve(process.cwd(),'./.config/.env'),
  encoding:'utf8'
})



if(envArgs.error){
  throw envArgs.error
}else {
  console.log('Build Project At:',isDevelopmentMode()?'development':'production')
}

mergeEnv()


function mergeEnv(envArgs){

}


var ProPaths = {
  SRC:"src",
  ASSETS:"public",
  BUILD:"build",
  DEST:"dist",
  CONFIG:".config"
}

var imagePreOpts = {

}

/* ======================= Edit Version =========================== */
const DAppInfoFile = `${ProPaths.CONFIG}/version-info.json`
console.log(DAppInfoFile)
gulp.task('edit:dappinfo',function(){
  return gulp.src(DAppInfoFile)
    .pipe(jsoneditor((json) => {
      console.log(JSON.stringify(json,null,2))
      return writeDAppInfo(json)
    }))
    .pipe(rename('info.json'))
    .pipe(gulp.dest(`${ProPaths.SRC}/scripts/dapp/`,{overwrite:true}))
})

function writeDAppInfo(json) {
  if(!json )json = {}
  let _ver = process.env.DAPP_VER || pkgJson.version
  let _ts = dateFormat.format(new Date())

  json.version = _ver
  json.name = process.env.DAPP_NAME || pkgJson.name ||'BasDApp'
  json.author = pkgJson.author || process.env.DAPP_AUTHOR
  json.buildTag = `${_ver}_${_ts}`

  console.log(JSON.stringify(json,null,2))

  return json
}

/* ====================== clean ========================== */
gulp.task('clean',function(){
  return del([`${ProPaths.BUILD}/**`])
})
/* =================== clean End ======================== */

/* ====================== Bundles ====================== */
//use browserify-shim see https://medium.com/@mattdesl/gulp-and-browserify-shim-f1c587cb56b9
const buildJsModules = [
  "basmlib",
  "dapp-info"
]

createTasksForBuildJSModules({
  taskPrefix:'modules:bundle',
  jsModules:buildJsModules,
  devMode:isDevelopmentMode(),
  destination:`${ProPaths.BUILD}/js`
})


function createTasksForBuildJSModules({
  taskPrefix,jsModules,devMode,destination,bundleTaskOpts = {}
}) {
  const rootDir = ProPaths.SRC
  bundleTaskOpts = Object.assign({
    devMode,
    sourceMapDir: '../sourcemaps',
    watch: isDevelopmentMode(),
    buildSourceMaps: !isDevelopmentMode(),
    minifyBuild: !isDevelopmentMode()
  },bundleTaskOpts)

  let subTasks = []

  buildJsModules.forEach((modu) => {
    let label = `${taskPrefix}:${modu}`

    gulp.task(label,createTasks4Module(Object.assign({
      label:label,
      filename:`${modu}.js`,
      filepath:`${rootDir}/scripts/${modu}.js`,
      destination
    },bundleTaskOpts)))

    subTasks.push(label)
  })

  gulp.task(taskPrefix,gulp.parallel(...subTasks))
}

function createTasks4Module(opts) {
  let suffixName = getBundleSuffix(opts.minifyBuild)

  let bundler

  return performBundle

  function performBundle () {
    if(!bundler){
      bundler = generateBrowserify(opts,performBundle)
      bundler.on('log',gutil.log)
    }

    let buildStream = bundler.bundle()

    buildStream.on('error',(err) =>{
      beep()
      if(opts.watch){
        console.warn(err.stack)
      }else {
        throw err
      }
    })

    buildStream = buildStream
      .pipe(source(opts.filename))
      .pipe(buffer())

    if(opts.buildSourceMaps){
      buildStream = buildStream
        .pipe(sourcemaps.init({loadMaps:true}))
    }

    if(opts.minifyBuild){
      buildStream = buildStream
        .pipe(terser({
          mangle:{
            reserved: ['BAS','Copyright (c) 2020 BAS']
          }
        }))
    }

    buildStream = buildStream
      .pipe(rename({extname:suffixName}))

    //Finalize Source Maps
    if(opts.buildSourceMaps){
      if(opts.devMode){
        buildStream = buildStream.pipe(sourcemaps.write())
      }else {
        buildStream = buildStream
          .pipe(sourcemaps.write(opts.sourceMapDir))
      }
    }

    buildStream.pipe(
      gulp.dest(
        opts.destination,
        {overwrite:true}
      )
    )

    return buildStream
  }
}

function generateBrowserify(opts,performBundle) {
  const bwOpts = assign({},watchify.args,{
    plugin:[],
    transform:[],
    debug:isDevelopmentMode(),
    entries:opts.filepath
  })

  let b = browserify(bwOpts)
    .transform('babelify')
    .transform('brfs')

  b.transform(envify({
    NODE_ENV:process.env.NODE_ENV || 'development'
  }),{
    global:true
  })

  return b
}

/* ====================== Bundles End Test Over ====================== */

/* ====================== Scss ====================== */
//handle

gulp.task('build:scss',createScssBuildTask({
  src:`${ProPaths.SRC}/scss/main.scss`,
  dest:`${ProPaths.BUILD}/css`,
  devMode:true,
  pattern:`${ProPaths.SRC}/scss/**/*.scss`
}))

function createScssBuildTask({src,dest,devMode,pattern}) {
  return function() {
    if(devMode){
      watch(pattern,async (event) =>{
        const stream = buildScss()
        await endOfStream(stream)
        console.log(`${event.path}`,'changed')
        livereload.changed(event.path)
      })

      return buildScssWithSourceMaps()
    }
    return  buildScss()
  }

  function buildScssWithSourceMaps() {
    return gulp.src(src)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error',sass.logError))
      .pipe(sourcemaps.write())
      .pipe(autoprefixer())
      .pipe(gulp.dest(dest,{overwrite:true}))
      .pipe(rtlcss())
      .pipe(rename({suffix:'-rtl'}))
      .pipe(gulp.dest(dest,{overwrite:true}))
  }

  function buildScss(){
    return gulp.src(src)
      .pipe(sass().on('error',sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest(dest,{overwrite:true}))
      .pipe(rtlcss())
      .pipe(rename({suffix:'-rtl'}))
      .pipe(gulp.dest(dest,{overwrite:true}))
  }
}

/* ============================ Commons Func =============================== */

function getBundleSuffix( isMinify ) {
  return isMinify ? '.min.js' : '-bundle.js'
}

function isDevelopmentMode(){
  //console.log(process.env.NODE_ENV)
  return !(process.env.NODE_ENV == 'production')
}

function beep() {
  process.stdout.write('\x07')
}
/* ================== defined global task at tail =========================== */

gulp.task('watch',function(){
  livereload.listen(liveOpts)
})

//keep 'edit:dappinfo' at first task
gulp.task('build',gulp.series(
  'edit:dappinfo',
  'clean',
  'build:scss',
  gulp.parallel(
    "modules:bundle"
  ),
  'watch'
))


//Default
gulp.task('default',gulp.series('build'))