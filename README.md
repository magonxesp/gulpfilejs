# Gulpfilejs
Compile javascript ES6 and SASS using Gulp

## Usage
* Install
    ```sh
    $ npm install --save-dev @magonxesp/gulpfilejs
    ```
* Create the ```gulpfile.js``` file
    ```sh
    $ touch gulpfile.js
    ```
* gulpfile.js   
    ```javascript
    const gulpfile = require("@magonxesp/gulpfilejs");
    
    gulpfile({
        src_js: '/path/to/js',
        src_scss: '/path/to/scss',
        dist: './dist'
    });
    ```