"use strict";

describe('transform angular to specification', function () {
    var inputFsJson, outputJson, expectedOutputJson, jsonTransformer;

    beforeEach(module('formularGenerator'));

    beforeEach(inject(function (_jsonTransformer_) {
        jsonTransformer = _jsonTransformer_;
    }));

    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath='base/shared/test/testcases/af_to_idp_spec';
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



  it('should transform empty spec', function(){

    var input = getJSONFixture('input_empty_form.json');
    var result  = jsonTransformer.transformAngularFormlyJsonToFormularSpecification(input);
    testJsonMapping(result, 'expected_empty_form.json')
  });

  it('should transform single textfield', function(){
    var singletextfield = [
      {
        "key": "test-mapping-key",
        "templateOptions": {
          "required": false,
          "label": "Text Input",
          "placeholder": "placeholder"
        },
        "type": "input"
      }
    ]

    var expected = {"id":0,"type":"form","metadata":[],"description":[],"children":[
      {
        "id":"foo",
        "type":"question",
        "description" : "",
        "interactives": [
          {
            "id":""
          }
        ]
      }
    ]};



  });

});




