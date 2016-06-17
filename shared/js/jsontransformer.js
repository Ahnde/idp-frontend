formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.createFormDataFromFormContent = function(formId, title, formularContent) {

      return formularDataFromMetadataAndContent(formId, title, formularContent);
    };

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {

      return angularFromIDPSpec(formularSpecification);
    };

    JT.transformAngularFormlyJsonToFormularSpecification = function(angularSpecification) {
      
      return formspecFromAngluar(angularSpecification);
    };

    return JT;
}]);