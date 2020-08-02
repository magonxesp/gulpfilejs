const fs = require('fs');
const path = require('path');

const packageBabelrc = path.join(__dirname, '.babelrc');
const rootDirectory = process.env.INIT_CWD || path.resolve("../../", __dirname);
const destBabelrc = path.join(rootDirectory, '.babelrc');

fs.copyFileSync(packageBabelrc, destBabelrc);