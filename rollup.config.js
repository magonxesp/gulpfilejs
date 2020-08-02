const babel = require('@rollup/plugin-babel');

module.exports = {
    input: 'src/index.js',
    output: {
        dir: 'output',
        format: 'esm'
    },
    plugins: [
        babel({ babelHelpers: 'bundled' })
    ]
};

// No usar esto
// mejor gulp + webpack + babel
// https://www.npmjs.com/package/webpack-stream
// https://medium.com/@renzocastro/webpack-babel-transpilando-tu-js-502244a61f5b