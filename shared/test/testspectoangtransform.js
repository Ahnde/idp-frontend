"use strict";

describe('jsonTransformer', function () {
    var inputFsJson, outputJson, expectedOutputJson, jsonTransformer;

    beforeEach(module('formularGenerator'));

    beforeEach(inject(function (_jsonTransformer_) {
        jsonTransformer = _jsonTransformer_;
    }));

    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath='base/shared/test/testcases/idp_spec_to_af';
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

    // recursive container
    it('should map recursive container to the appropriate af-json-array', function () {
        var testcase = getJSONFixture('testcase_container_recursion.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_container_recursion.json')
    });

    // one text description
    it('should map a text description to an af-label', function () {
        var testcase = getJSONFixture('testcase_single_description_text.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_description_text.json')
    });

    // one image description one url
    it('should map an image description including one url to an af-label', function () {
        var testcase = getJSONFixture('testcase_single_description_image_single_url.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_single_description_image_single_url.json')
    });

    // one image description many urls
    it('should map an image description including many urls to an af-label', function () {
        var testcase = getJSONFixture('testcase_single_description_image_many_urls.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_single_description_image_many_urls.json')
    });

    // one video description one url
    it('should map a video description including one url to an af-label', function () {
        var testcase = getJSONFixture('testcase_single_description_video_single_url.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_single_description_video_single_url.json')
    });

    // one video description many urls
    it('should map a video description including many urls to an af-label', function () {
        var testcase = getJSONFixture('testcase_single_description_video_many_urls.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_single_description_video_many_urls.json')
    });

    // many descriptions
    it('should map many descriptions to many af-labels and images', function () {
        var testcase = getJSONFixture('testcase_many_descriptions.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_many_descriptions.json')
    });
    
    // one inputfield
    it('should map one interactive inputfield to one af-inputfield', function () {
        var testcase = getJSONFixture('testcase_single_inputfield.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_inputfield.json')
    });

    // many inputfields
    it('should map many interactive inputfields to many af-inputfields', function () {
        var testcase = getJSONFixture('testcase_many_inputfields.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);
        
        testJsonMapping(result, 'expected_testcase_many_inputfields.json')
    });

    // one textarea
    it('should map one interactive textarea to one af-textarea', function () {
        var testcase = getJSONFixture('testcase_single_textarea.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_single_textarea.json')
    });

    // many textareas
    it('should map many interactive textareas to many af-textareas', function () {
        var testcase = getJSONFixture('testcase_many_textareas.json');
        var result = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(testcase);

        testJsonMapping(result, 'expected_testcase_many_textareas.json')
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

});


