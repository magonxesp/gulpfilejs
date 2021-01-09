const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const sass = require('gulp-sass');
const _clean = require('gulp-clean');

let build_paths = {
    js: {
        webpack_config_path: undefined,
        src: 'index.js',
        dist: {
            dirname: 'dist/js',
            filename: 'bundle.js',
        },
        mode: 'development'
    },
    scss: {
        src: './scss/style.scss',
        dist: './dist/css',
    }
};

let available_tasks = [];

function clean() {
    let paths = [];

    for (let type in build_paths) {
        if (typeof build_paths[type].dist !== 'undefined') {
            if (typeof build_paths[type].dist === 'object' && build_paths[type].dist.dirname) {
                paths.push(build_paths[type].dist.dirname);
            } else {
                paths.push(build_paths[type].dist);
            }
        }

    }

    return gulp.src(paths, {read: false})
        .pipe(_clean());
}

function scss() {
    return gulp.src(build_paths.scss.src)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(build_paths.scss.dist));
}

function defaultWebpackConfig() {
    let config = require(path.join(__dirname, 'webpack.config.js'));

    config.mode = build_paths.js.mode;
    config.entry = path.resolve(build_paths.js.src);
    config.output = {
        path: path.resolve(build_paths.js.dist.dirname),
        filename: build_paths.js.dist.filename
    };

    return config;
}

function compileWebpackJs() {
    let config = {};

    if (typeof build_paths.js.webpack_config_path !== 'undefined') {
        config = require(path.resolve(build_paths.js.webpack_config_path));
    } else {
        config = defaultWebpackConfig();
    }

    return new Promise(((resolve, reject) => {
        webpack(config, (error, status) => {
            if (error) {
                reject(error);
            }

            if (status && status.hasErrors()) {
                reject(status);
            }

            resolve();
        });
    }));
}

function js() {
    return compileWebpackJs();
}

function buildWatch() {
    let srcPaths = [];

    for (let type in build_paths) {
        if (typeof build_paths[type].src !== 'undefined') {
            srcPaths.push(path.join(path.resolve(path.dirname(build_paths[type].src))));
        }
    }

    gulp.watch(srcPaths, { events: 'all' }, gulp.series(...available_tasks));
}

/**
 * @param {{
 *     js: {
 *          webpack_config_path: string,
 *          src: string,
 *          dist: {
 *              dirname: string
 *              filename: string
 *          },
 *          mode: ('development' | 'dev' | 'prod' | 'production')
 *     },
 *     scss: {
 *         src: string,
 *         dist: string
 *     }
 *  }} paths
 * @example
 *  require("@magonxesp/gulpfilejs") ({
 *      js: {
 *          webpack_config_path: './webpack.config.js',
 *      },
 *      scss: {
 *         src: './scss/style.scss',
 *         dist: './dist/css/style.css',
 *      }
 * });
 * // Or using default webpack configuration
 * require("@magonxesp/gulpfilejs") ({
 *      js: {
 *          src: 'js/index.js',
 *          dist: {
 *              dirname: 'dist/js',
 *              filename: 'bundle.js'
 *          },
 *          mode: 'development'
 *      },
 *      scss: {
 *         src: './scss/style.scss',
 *         dist: './dist/css/style.css',
 *      }
 * });
 */
function buildTasks(paths) {
    build_paths = paths;

    if (typeof build_paths.js !== 'undefined') {
        gulp.task('js', js);
        available_tasks.push(js);
    }

    if (typeof build_paths.scss !== 'undefined') {
        gulp.task('scss', scss);
        available_tasks.push(scss);
    }

    gulp.task('clean', clean);
    // gulp.task('watch', buildWatch);
    gulp.task('default', gulp.series(...available_tasks));
}

module.exports = buildTasks;