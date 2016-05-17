// Karma configuration
// Generated on Sat Dec 26 2015 13:10:02 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../../../idp-editor',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      
    "app/js/dependencies/jquery.min.js",
    "app/js/dependencies/bootstrap.min.js",
    "app/js/dependencies/angular.js",
    '../idp-frontend/node_modules/angular-mocks/angular-mocks.js',
//    '../idp-frontend/node_modules/diff/dist/diff.js',
//    '../idp-frontend/node_modules/requirejs/require.js',




    "app/js/dependencies/angular-route.js",
    "../idp-frontend/shared/js/transformMethods.js",
    "app/js/services/formSpecificationMapper.js",
    "app/js/dependencies/AngularFormbuilder/angular-form-builder.js",
    "app/js/dependencies/AngularFormbuilder/angular-form-builder-components.js",
    "app/js/dependencies/angular-validator.min.js",
    "app/js/dependencies/angular-validator-rules.min.js",
    "app/js/dependencies/jquery-ui.js",
    "app/js/dependencies/placeholders.min.js",
    "app/js/dependencies/apiCheck.min.js",
    "app/js/dependencies/formly.js",
    "app/js/dependencies/angular-formly-templates-bootstrap.js",
    "app/js/dependencies/angular-file-upload-shim.js",
    "app/js/dependencies/angular-file-upload.js",
    "app/js/formEditorApp.js",
    "app/js/formlyCustomTypes.js",
    "app/js/dependencies/AngularFormbuilder/angular-form-customComponents.js",
    "app/js/FormConstant.js",
    "app/js/services/Factory.js",
    "app/js/services/CommonService.js",
    "app/js/Directive.js",

    "app/js/Controller/FormCtrl.js",
      "app/js/formEditorApp.js",      
        //tests
     '../idp-frontend/shared/test/editortests.js',
//      '../idp-frontend/node_modules/karma-jasmine-diff-reporter/src/jasmine-diff.js',
        // fixtures
      {pattern: '../idp-frontend/shared/test/testcases/editor/*.json', watched: true, served: true, included: false},
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
  //  reporters: ['jasmine-diff','clear-screen', 'dots'],
    reporters: ['clear-screen', 'dots'],

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
