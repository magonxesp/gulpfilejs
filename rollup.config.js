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