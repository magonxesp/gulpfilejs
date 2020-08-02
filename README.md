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
    require("@magonxesp/gulpfilejs") ({
        src: {
            js: {
                source: '/path/to/js',
                entry_points: '/path/to/main.js'
            },
            css: '/path/to/css'
        },
        dist: {
            js: './dist/js',
            css: './dist/css'
        }
     });
    ```