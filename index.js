const path = require('path');
const { src, dest, task, watch, run } = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

let buils_paths = {
    src_js: '',
    src_scss: '',
    dist: './dist'
};

function buildcss() {
    return src(buils_paths.src_scss)
        .pipe(sourcemaps.init())
        .pipe(plumber());
}

function buildjs() {
    // This will grab any file within src/ or its
    // subdirectories, then ...
    return src(buils_paths.src_js)
        .pipe(sourcemaps.init())
        // Stop the process if an error is thrown.
        .pipe(plumber())
        // Transpile the JS code using Babel's preset-env.
        .pipe(babel())
        // bundle in one file
        .pipe(concat('bundle.js'))
        // Generate sourcemaps
        .pipe(sourcemaps.write('.'))
        // Save each component as a separate file in dist.
        .pipe(dest(buils_paths.dist));
}

function uglifyjs() {
    return src(path.join(buils_paths.dist, 'build.js'))
        .pipe(uglify())
        .pipe(dest(buils_paths.dist));

}

function build() {
    run('build-js');
    run('build-css');
}

function buildWatch() {
    return watch([buils_paths.src_js, buils_paths.src_scss], build);
}

/**
 * @param paths
 * @example
 *  const gulpfile = require("@magonxesp/gulpfilejs");
 *
 *  gulpfile({
 *      src_js: '/path/to/js',
 *      src_scss: '/path/to/scss',
 *      dist: './dist'
 *  });
 */
function buildTasks(paths) {
    buils_paths = paths;

    task('default', build);
    task('build-js', buildjs);
    task('build-css', buildcss);
    task('watch', buildWatch);
}

module.exports = buildTasks;