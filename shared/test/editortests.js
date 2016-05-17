"use strict";
//var EditorConfig = injector.get("getEditorConfig");


function getMissing(obj1, obj2) {

  function getClass(obj) {
    if (typeof obj === "undefined")
      return "undefined";
    if (obj === null)
      return "null";
    return Object.prototype.toString.call(obj)
      .match(/^\[object\s(.*)\]$/)[1];
  }

  function rec(o1, o2, acc, mis) {
    for (var k in o1) {
      if(o2.hasOwnProperty(k)) {
        var c = getClass(o1[k]);
        if(c === "Object" || c === "Array") {
          acc[k] = (c === "Object")? {} : [];
          var r = rec(o1[k],o2[k],acc[k], false);
          if(r.m == false) {
            delete acc[k];
          } else {
            mis = true
          };
        };
      } else {
        acc[k] = "--missing--";
        mis = true;
      }
    };
    return {a:acc,m:mis};
  };
  return rec(obj1, obj2,{}, false).a;
};



describe('IDP and angular from IM', function () {

  beforeEach(module("formlyExample"));
  var OIMConfigMapper;
  beforeEach(inject(function(_getOIMConfig_) {
    OIMConfigMapper = _getOIMConfig_;
  }));


  it("maps empty form ",function(){
    var resultIM = OIMConfigMapper.getOIMConfig([], {default:[]});
    //angular
    var resAnSpec = resultIM.anSpec;
    var expectedAnSpec = [];

    //idp
    var resIdpSpec = resultIM.idpSpec;
    var expectedIdpSpec = {"element_id":"0","element_type":"form","metadata":[],"children":[]};

    expect(resAnSpec).toEqual(expectedAnSpec);
    expect(resIdpSpec).toEqual(expectedIdpSpec);
  });


  it("maps one textfield",function(){

      var optionsOriginal = [{"component":"textInput",
                              "editable":true,
                              "index":0,
                              "label":"Text Input",
                              "postLabel":"Post Label",
                              "description":"description",
                              "placeholder":"placeholder",
                              "options":[],
                              "required":false,
                              "validation":"/.*/",
                              "id":"default-textInput-1188",
                              "isContainer":false,
                              "templateOptions":{},
                              "expressionProperties":"",
                              "noFormControl":true,
                              "customModel":{},
                              "$$hashKey":"object:50"}];
      var builderForms = {"default":[optionsOriginal[0]]};
      var resultOIM = OIMConfigMapper.getOIMConfig(optionsOriginal, builderForms);

      //angular
      var resAnSpec = resultOIM.anSpec;
      var expectedAnSpec = [
        {
          "type":"input",
          "key":"mappingKey-1",
          "templateOptions": {
            "label":"Text Input",
            "postLabel":"Post Label",
            "placeholder":"placeholder"
          },
          "validators":{

          },
          "expressionProperties":{}
        }];

      //idp
      // var resIdpSpec = resultOIM.idpSpec;
      // var expectedIdpSpec = {"element_id":"0",
      //                        "element_type":"form",
      //                        "metadata":[],
      //                        "children":[
      //                          {
      //                            "element_id":"2",
      //                            "mapping_key":"mappingKey-1",
      //                            "element_type":"interactive",
      //                            "validators":["/.*/"],
      //                            "interactive_details": {
      //                              "label":"Text Input",
      //                              "placeholder":"placeholder"
      //                            },
      //                            "interactive_type":"input"
      //                          }]
      //                       };
    console.log("----");
    console.log(JSON.stringify(resAnSpec));
    console.log(JSON.stringify(expectedAnSpec));
    console.log("----");
    console.log(JSON.stringify(getMissing(resAnSpec,expectedAnSpec)));
    console.log(JSON.stringify(getMissing(expectedAnSpec,resAnSpec)));

    expect(resAnSpec).toEqual(expectedAnSpec);
//    expect(resIdpSpec).toEqual(expectedIdpSpec);

  });

});


describe('IM from IDP', function () {

});
