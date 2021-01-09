const fs = require('fs');
const path = require('path');

const packageFiles = [
    '.babelrc',
    'webpack.config.js',
    'gulpfile.js'
];

for (let file of packageFiles) {
    const packageBabelrc = path.join(__dirname, file);
    const rootDirectory = process.env.INIT_CWD || path.resolve("../../", __dirname);
    const destBabelrc = path.join(rootDirectory, file);

    fs.copyFileSync(packageBabelrc, destBabelrc);
}
