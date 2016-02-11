"use strict";

describe('jsonTransformer', function () {
    var inputFsJson, outputJson, expectedOutputJson, jsonTransformer;

    beforeEach(module('formularGenerator'));

    beforeEach(inject(function (_jsonTransformer_) {
        jsonTransformer = _jsonTransformer_;
    }));

    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath='base/test/testcases';
        inputFsJson = {};
        expectedOutputJson = {};
        outputJson = {};
    });
    
    function testJsonMapping(result, expectedpath)
    {
        var expected = getJSONFixture(expectedpath);

        var resultIsEqualToExpected = angular.equals(result, expected);
        expect(resultIsEqualToExpected).toBeTruthy();
    } 

    // empty form
    it('should map an empty form to an empty af-json-array', function () {
        var testcase = getJSONFixture('testcase_empty_form.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_empty_form.json')
    });

    // one question
    it('should map one question without any interactive elements to an empty af-question', function () {
        var testcase = getJSONFixture('testcase_single_question_without_interactive.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_question_without_interactive.json')
    });

    // many questions
    it('should map many questions without any interactive elements to many empty af-questions', function () {
        var testcase = getJSONFixture('testcase_many_questions.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_questions.json')
    });

    // recursive groups
    it('should map recursive group to the appropriate af-json-array', function () {
        var testcase = getJSONFixture('testcase_group_recursion.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_group_recursion.json')
    });

    // one description
    it('should map a question with an description to an af-label', function () {
        var testcase = getJSONFixture('testcase_single_description.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_description.json')
    });

    // many descriptions
    it('should map a question with many descriptions to many af-labels and images', function () {
        var testcase = getJSONFixture('testcase_many_descriptions.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_many_descriptions.json')
    });
    
    // one inputfield
    it('should map one interactive textfield to one af-inputfield', function () {
        var testcase = getJSONFixture('testcase_single_inputfield.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_inputfield.json')
    });

    // many inputfields
    // TODO: support different types
    it('should map many interactive textfields to many af-inputfields', function () {
        var testcase = getJSONFixture('testcase_many_inputfields.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_inputfields.json')
    });

    // one checkbox
    it('should map one interactive checkbox to one af-checkbox', function () {
        var testcase = getJSONFixture('testcase_single_checkbox.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_checkbox.json')
    });

    // many checkboxes
    it('should map many interactive checkboxes to many af-checkboxes', function () {
        var testcase = getJSONFixture('testcase_many_checkboxes.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_checkboxes.json')
    });

    // one radiobutton
    it('should map one interactive radiobutton to one af-radiobutton', function () {
        var testcase = getJSONFixture('testcase_single_radio.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_radio.json')
    });

    // many radiobuttons
    it('should map many interactive radiobuttons to many af-radiobuttons', function () {
        var testcase = getJSONFixture('testcase_many_radios.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_radios.json')
    });

    // one dropdown
    it('should map one interactive dropdown to one af-dropdown', function () {
        var testcase = getJSONFixture('testcase_single_dropdown.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_dropdown.json')
    });

    // many dropdowns
    it('should map many interactive dropdowns to many af-dropdowns', function () {
        var testcase = getJSONFixture('testcase_many_dropdowns.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_dropdowns.json')
    });

    // one date
    it('should map one interactive date to one af-date', function () {
        var testcase = getJSONFixture('testcase_single_date.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_date.json')
    });

    // many dates
    it('should map many interactive dates to many af-dates', function () {
        var testcase = getJSONFixture('testcase_many_dates.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_dates.json')
    });

    // various interactives
    it('should map many different interactive elements to the appropriate af-json', function () {
        var testcase = getJSONFixture('testcase_many_interactives.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_interactives.json')
    });

    // mixed fs
    it('should transform the mixed stff', function () {
        var testcase = getJSONFixture('mock_formularSpecification.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        // dump(JSON.stringify(result));
        testJsonMapping(result, 'mock_angularFormly.json')
    });
});

// describe("asyncTest", function() {
//     var flag = false;

//     beforeEach(function(done) {
//         setTimeout(function () {
//             flag = true;
//             done();
//         }, 2000);
//     });

//     it("should be successful", function() {
//         expect(flag).toBeTruthy();
//     });
// });


// describe("asyncTest", function() {
//     var $httpBackend, $rootScope, createController, authRequestHandler;

//     beforeEach(module('formularGenerator'));

//     beforeEach(inject(function($injector) {
//         // Set up the mock http service responses
//         $httpBackend = $injector.get('$httpBackend');
//         // backend definition common for all tests
//         authRequestHandler = $httpBackend.when('GET', '/auth.py').respond({userId: 'userX'}, {'A-Token': 'xxx'});

//         // Get hold of a scope (i.e. the root scope)
//         $rootScope = $injector.get('$rootScope');
//         // The $controller service is used to create instances of controllers
//         var $controller = $injector.get('$controller');

//         createController = function() {
//             return $controller('formularGenerator', {'$scope' : $rootScope });
//         };
//     }));

//     afterEach(function() {
//        $httpBackend.verifyNoOutstandingExpectation();
//        $httpBackend.verifyNoOutstandingRequest();
//     });

//     it('should fetch authentication token', function() {
//         $httpBackend.expectGET('/auth.py');
//         var controller = createController();
//         $httpBackend.flush();
//     });
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
//         backendConnector.getFormularSpecification(
//             function(formularSpecification) {
//                 dump("drin");
//                 fsresponse = formularSpecification;
//                 dump(formularSpecification);
//                 dump(fsresponse);
//                 done();
//             }
//         )
//         // httpBackend.expectGET(backendConnector.getFormularSpecification()).respond(200, {});
//         // httpBackend.flush();
//         dump("danach");
//     });

//     it("should not return an error when getting the FS", function() {
//         dump(fsresponse);
//         expect(1).toBeGreaterThan(0);
//     });

//     afterEach(function() {
//       jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
//     });
// });

// describe("backendConnector", function() {
//     var backendConnector, httpBackend, fsresponse, originalTimeout;

//     beforeEach(module('formularGenerator'));

//     beforeEach(inject(function (_backendConnector_, $httpBackend) {
//         backendConnector = _backendConnector_;
//         httpBackend = $httpBackend;
//     }));

//     beforeEach(function(done) {
//         backendConnector.getFormularSpecification(
//             function(formularSpecification) {
//                 fsresponse = formularSpecification;
//                 done();
//             }
//         )

//         httpBackend.whenGET("http://localhost:8000/response.json", undefined, undefined, ['id'])
//                    .respond(function(method, url, data, headers, params) { 
//                         dump("params");
//                         dump(params);
//                    });



//         httpBackend.expectGET("http://localhost:8000/response.json");
//         httpBackend.flush();
//     });

//     it("should return a JSON-object", function() {
//         dump(fsresponse);
//         expect(fsresponse).toEqual({ "test": "json" });
//     });
// });



















