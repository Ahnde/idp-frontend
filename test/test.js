"use strict";

describe("true", function () {
    it("Should be true", function () {
       var myBool = true;
       dump(myBool);
       expect(true).toBeTruthy();
    });
});

describe("true", function () {
    it("Should be true", function () {
        expect(true).toBe(false);
    });
});

describe('jsonTransformer', function () {

    beforeEach(module('formularGenerator'));

    var $controller, inputJson, outputJson, expectedOutputJson;

    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;

        jasmine.getJSONFixtures().fixturesPath='base/test/mock';

        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET('http://localhost:8080/IDPBackend/rest/form/2').respond(
            inputJson = getJSONFixture('mock_formularSpecification.json')
        );

        expectedOutputJson = getJSONFixture('mock_angularFormly.json'); 

    }));

    describe('Complete transformation', function () {
        beforeEach(inject(function () {

            it('should have transformed the FS-JSON to the correct AF-JSON', function () {
                // $httpBackend.flush();
                outputJson = getJSONFixture('mock_angularFormly.json'); //todo: transform

                var $scope = {};
                var controller = $controller('jsonTransformer', {$scope: $scope});

                expect(outputJson).toBe(expectedOutputJson);
            });
        }));
    });
});