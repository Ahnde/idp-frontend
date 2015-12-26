// Karma configuration
// Generated on Fri Dec 25 2015 16:53:53 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // Karma will require() these plugins
    plugins: [
        'karma-jasmine',
        'karma-chrome-launcher'

        // inlined plugins
        // {'framework:xyz': ['factory', factoryFn]},
        // require('./plugin-required-from-config')
    ],

    // list of files / patterns to load in the browser
    files: [
        // 'test/test-dependencies/process/index.js',
        // 'test/test-dependencies/path/path.js',
        // 'test/test-dependencies/requirejs/require.js',
        // 'dependencies/angular/angular.min.js',
        // 'test/test-dependencies/angular-mocks/angular-mocks.js',
        // 'test/test-dependencies/jasmine/lib/jasmine.js',
        // 'test/test-dependencies/jasmine-core/lib/jasmine-core.js',
        'dependencies/angular/angular.min.js',
        'dependencies/angular-formly/dist/formly.js',
        'dependencies/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
        'test/tests/*.js',
        'app/js/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
