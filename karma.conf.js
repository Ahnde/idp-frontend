// Karma configuration
// Generated on Sat Dec 26 2015 13:10:02 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
    	'node_modules/angular/angular.js',
        'node_modules/api-check/dist/api-check.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/angular-formly/dist/formly.js',
        'node_modules/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
        'node_modules/requirejs/require.js',
        'node_modules/jsen/dist/jsen.js',
    	'app/js/formulargenerator.js',
      	'app/js/*.js',
      	'test/*.js',

        // fixtures
        {pattern: 'test/testcases/*.json', watched: true, served: true, included: false}
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
    reporters: ['clear-screen', 'progress'],


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
