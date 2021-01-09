require('@magonxesp/gulpfilejs')({
    js: {
        webpack_config_path: './webpack.config.js',
    },
    scss: {
        src: './scss/style.scss',
        dist: './dist/css',
    }
});