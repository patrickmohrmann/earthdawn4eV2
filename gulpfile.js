const gulp = require("gulp");
const less = require("gulp-less");

/********************/
/*      LESS        */
/********************/

function buildStyles() {
  return gulp.src(`styles/less/styles.less`)
      .pipe(less())
      .pipe(gulp.dest(`./styles`));
}

function watch() {
  gulp.watch(`styles/less/**/*.less`, { ignoreInitial: false }, buildStyles);
}

exports.less = buildStyles;
exports.watch = watch;
