const fs = require('fs');
const path = require('path');

const packageBabelrc = path.join(__dirname, '.babelrc');
const destBabelrc = path.join('.', '.babelrc');

fs.copyFileSync(packageBabelrc, destBabelrc);