formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {

      return angularFromIDPSpec(formularSpecification);
    };

  JT.transformAngularFormlyJsonToFormularSpecification = function(angularSpecification) {
    
    return formspecFromAngluar(angularSpecification);
  };



    return JT;
}]);