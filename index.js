const path = require('path');
const { src, dest, task, watch, run } = require('gulp');
const babel = require('rollup-plugin-babel');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

let build_paths = {
    src: {
        js: {
            source: '',
            entry_points: []
        },
        css: ''
    },
    dist: {
        js: '',
        css: ''
    }
};

function buildcss() {
    return src(build_paths.src.css)
        .pipe(sourcemaps.init())
        .pipe(plumber());
}

function buildjs() {
    // This will grab any file within src/ or its
    // subdirectories, then ...
    return rollup({
            input: build_paths.src.js.entry_points,
            format: 'umd',
            plugins: [
                babel(),
            ]
        })
        .pipe(source(build_paths.src.js.entry_points))
        .pipe(buffer())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(build_paths.dist.js));
}

function uglifyjs() {
    return src(path.join(build_paths.dist.js, 'build.js'))
        .pipe(uglify())
        .pipe(dest(build_paths.dist.js));

}

function build() {
    run('build-js');
    run('build-css');
}

function buildWatch() {
    return watch([build_paths.src.js, build_paths.src.js], build);
}

/**
 * @param {{
 *      src: {
 *          js: {
 *              source: string,
 *              entry_points: string|string[]
 *          },
 *          css: string
 *      },
 *      dist: {
 *          js: string,
 *          css: string
 *     }
 *  }} paths
 * @example
 *  require("@magonxesp/gulpfilejs") ({
 *      src: {
 *          js: {
 *              source: '/path/to/js',
 *              entry_points: '/path/to/main.js'
 *          },
 *          css: '/path/to/css'
 *      },
 *      dist: {
 *          js: './dist/js',
 *          css: './dist/css'
 *      }
 *  });
 */
function buildTasks(paths) {
    build_paths = paths;

    task('default', build);
    task('buildjs', buildjs);
    task('buildcss', buildcss);
    task('watch', buildWatch);
}

module.exports = buildTasks;