const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

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
        dist: './dist/css/style.css',
    }
};

let available_tasks = [];

function scss() {
    return gulp.src(build_paths.scss.src)
        .pipe(sourcemaps.init())
        .pipe(plumber());
}

function defaultWebpackConfig() {
    return {
        mode: build_paths.js.mode,
        entry: path.resolve(__dirname, build_paths.js.src),
        output: {
            path: path.resolve(__dirname, build_paths.js.dist.dirname),
            filename: build_paths.js.dist.filename
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.js$/,
                    use: ['source-map-loader'],
                    enforce: 'pre'
                },
            ]
        }
    };
}

function compileWebpackJs() {
    let config = {};

    if (typeof build_paths.js.webpack_config_path !== 'undefined') {
        config = require(build_paths.js.webpack_config_path);
    } else {
        config = defaultWebpackConfig();
    }

    return new Promise(((resolve, reject) => {
        webpack(config, (error, status) => {
            if (error) {
                reject(error);
            }

            if (status.hasErrors()) {
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

    gulp.task('watch', buildWatch);
    gulp.task('default', gulp.series(...available_tasks));
}

module.exports = buildTasks;