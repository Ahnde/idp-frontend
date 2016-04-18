formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.createResponseForLabelAndData = function(dataLabel, formularData) {

      return jsonFromLabelAndData(dataLabel, formularData);
    };

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {

      return angularFromIDPSpec(formularSpecification);
    };

    JT.transformAngularFormlyJsonToFormularSpecification = function(angularSpecification) {
      
      return formspecFromAngluar(angularSpecification);
    };

    return JT;
}]);