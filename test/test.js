"use strict";

describe('jsonTransformer', function () {

    var inputFsJson, outputJson, expectedOutputJson, jsonTransformer, httpBackend;

    beforeEach(module('formularGenerator'));

    beforeEach(inject(function (_jsonTransformer_, $httpBackend) {
        jsonTransformer = _jsonTransformer_;
        httpBackend = $httpBackend;
    }));

    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
        inputFsJson = getJSONFixture('mock_formularSpecification-schema.json');
        expectedOutputJson = getJSONFixture('mock_angularFormly.json');
        outputJson = {};
    });
    
    it('should have transformed the FS-JSON to the correct AF-JSON', function () {
        
        outputJson = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(inputFsJson);

        expect(outputJson).toBe(expectedOutputJson);
    });
});