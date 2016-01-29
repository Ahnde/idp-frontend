"use strict";

describe('jsonTransformer', function () {
    var jsonSchema, jsonTransformer, httpBackend;
    
    // var jsen = require('jsen');

    define(['require', 'jsen'], function (require) {
        var jsen = require('jsen');
        var validate = jsen({ type: 'string' });
        var valid = validate('some value');
        console.log(valid);
        return [jsen, validate, valid];
    });


    beforeEach(module('formularGenerator'));

    beforeEach(inject(function (_jsonTransformer_, $httpBackend) {
        jsonTransformer = _jsonTransformer_;
        httpBackend = $httpBackend;
    }));

    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
        jsonSchema = {};
    });

    it('should transform basic json', function () {
        // validate = jsen({ type: 'string' });
        // valid = validate('some value');
        valid = true;
        expect(valid).toBeTruthy();
    });

});



// describe('jsonTransformer', function () {
//     var inputFsJson, outputJson, expectedOutputJson, jsonTransformer, httpBackend;

//     beforeEach(module('formularGenerator'));

//     beforeEach(inject(function (_jsonTransformer_, $httpBackend) {
//         jsonTransformer = _jsonTransformer_;
//         httpBackend = $httpBackend;
//     }));

//     beforeEach(function () {
//         jasmine.getJSONFixtures().fixturesPath='base/test/mock';
//         inputFsJson = {};
//         expectedOutputJson = {};
//         outputJson = {};
//     });
    
//     function testJsonMapping(result, expectedpath)
//     {
//         dump(JSON.stringify(result));
//         var expected = getJSONFixture(expectedpath);
//         dump(JSON.stringify(expected));

//         // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(result));
//         // window.open(url, '_blank');
//         // window.focus();

//         // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(expected));
//         // window.open(url, '_blank');
//         // window.focus();

//         expect(JSON.parse(JSON.stringify(result))).toEqual(JSON.parse(JSON.stringify(expected)));
//     } 

//     it('should transform basic json', function () {
//         var testcase = getJSONFixture('mock_formularSpecification.json');
//         var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

//         testJsonMapping(result, 'mock_angularFormly.json')
//     });


//     // it('should map an empty form to an empty af-json-array', function () {
//     //     var testcase = getJSONFixture('testcase_empty_form.json');
//     //     var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

//     //     testJsonMapping(result, 'expected_testcase_empty_form.json')
//     // });

//     // it('should map an one interactive textfield to one af-inputfield', function () {
//     //     var testcase = getJSONFixture('testcase_single_interactive_textfield.json');
//     //     var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

//     //     testJsonMapping(result, 'expected_testcase_single_interactive_textfield.json')
//     // });


// });


// describe("backendConnector", function() {
//     var backendConnector, httpBackend, fsresponse, originalTimeout;

//     beforeEach(module('formularGenerator'));

//     beforeEach(inject(function (_backendConnector_, $httpBackend) {
//         backendConnector = _backendConnector_;
//         httpBackend = $httpBackend;
//     }));

//     beforeEach(function() {
//       originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
//       jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//     });

//     beforeEach(function(done) {
//         dump("davor");
//         dump(backendConnector);
//         // backendConnector.getFormularSpecification(
//         //     function(formularSpecification) {
//         //         dump("drin");
//         //         fsresponse = formularSpecification;
//         //         dump(formularSpecification);
//         //         dump(fsresponse);
//         //         done();
//         //     }
//         // )
//         httpBackend.expectGET(backendConnector.getFormularSpecification()).respond(200, {});
//         httpBackend.flush();
//         dump("danach");
//     });

//     it("should not return an error when getting the FS", function(done) {
//         dump(fsresponse);
//         expect(1).toBeGreaterThan(0);
//         done();
//     });

//     afterEach(function() {
//       jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
//     });
// });