formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {
        // console.log("Transforming Json:");
        // console.log(formularSpecification);
        // console.log("");

        var formularSpecificationArray = formularSpecification['children'];
        var angularFormlyJsonArray = [];

        for (var objectNumber in formularSpecificationArray) {
            var currentFsJson = formularSpecificationArray[objectNumber];
            var currentAfArray = angularFormlyJsonArrayForFsJson(currentFsJson);
            angularFormlyJsonArray = angularFormlyJsonArray.concat(currentAfArray);
        };

        //console.log("");
        //console.log("The array with the transformed Json:");
        //console.log(angularFormlyJsonArray);
        //console.log("");

        var json = JSON.stringify(angularFormlyJsonArray);
        // console.log(json);
        // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(json);
        // window.open(url, '_blank');
        // window.focus();

        return angularFormlyJsonArray;
    };

    var angularFormlyJsonArrayForFsJson = function(fsJson) {
        // console.log("Generate angular formly Json for Json:");
        // console.log(fsJson);

        var afJsonArray = [];
        
        if (fsJson['elementType'] === "group") {
            // console.log("Found GROUP");
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForGroup(fsJson));
        } else if(fsJson['elementType'] === "question") {
            // console.log("found QUESTION");
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForQuestion(fsJson));
        } else {
            //console.log("No match for generating Json found.");
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForGroup = function(fsGroupJson) {
        var afJsonArray = [];

        // console.log("Generate angular formly Json for GROUP:");
        // console.log(fsGroupJson);

        //TODO add groupspecific attributes to angularFormlyJsonArray
        var fsGroupJsonArray = fsGroupJson['children'];

        for (var i in fsGroupJsonArray) {
            //console.log("Call again angularFormlyJsonArrayForFsJson with groups child element:");
            //console.log(fsGroupJsonArray[i]);
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForFsJson(fsGroupJsonArray[i]));
        };
        
        return afJsonArray;
    };

    var angularFormlyJsonArrayForQuestion = function(fsQuestionJson) {
        var afJsonArray = [];

        // console.log("Generate angular formly Json for QUESTION:");
        // console.log(fsQuestionJson);

        //TODO add questionspecific attributes to angularFormlyJsonArray

        if (fsQuestionJson['interactives']) {
            // console.log("The question contains interactive elements:");
            // console.log(fsQuestionJson['interactives']);
            afJsonArray = angularFormlyJsonArrayForInteractive(fsQuestionJson['interactives']);
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForInteractive = function(fsInteractiveJsonArray) {
        var afJsonArray = [];

        // console.log("Generate angular formly Json for INTERACTIVE:");
        // console.log(fsInteractiveJsonArray);
        
        //TODO add interactivespecific attributes to angularFormlyJsonArray

        for (var i in fsInteractiveJsonArray) {
            var currentFsInteractiveJson = fsInteractiveJsonArray[i];

            var afJson = {};

            var fsJsonTypeString = currentFsInteractiveJson['elementType'];
            if (fsJsonTypeString === 'error') {
                //Return since no interactive details should be added due to error-type
                //console.log("Object has no valid type");
                continue;
            };

            afJson.type = angularFormlyTypeStringForFsTypeString(fsJsonTypeString);
            
            afJson.key = currentFsInteractiveJson['mappingKey'];

            //TODO: validators

            var fsSpecificInteractiveJson = currentFsInteractiveJson['interactiveDetails'];
            afJson.templateOptions = templateOptionsForInteractiveFsJson(fsSpecificInteractiveJson);            

            afJsonArray.push(afJson);
        };

        return afJsonArray;
    };

    var angularFormlyTypeStringForFsTypeString = function(fsTypeString) {
        switch (fsTypeString) {
                case "textfield":
                    return "input";
                case "checkbox":
                    return "checkbox";
                case "radio":
                    return "radio";
                case "dropdown":
                    return "select";
                case "date":
                    return "datepicker";
                default:
                    return "error";
        }
    };

    var templateOptionsForInteractiveFsJson = function(fsSpecificInteractiveJson){
        var templateOptions = {};

        templateOptions.label = fsSpecificInteractiveJson['label'];

        if (fsSpecificInteractiveJson['length']) {
            //TODO: tempalte does not support this feature, yet
        }
        if (fsSpecificInteractiveJson['placeholder']) {
            templateOptions.placeholder = fsSpecificInteractiveJson['placeholder'];
        };
        if (fsSpecificInteractiveJson['textfieldType']) {
            //TODO: tempalte does not support this feature, yet
        }
        if (fsSpecificInteractiveJson['dateFormat']) {
            templateOptions.type = "text";
            templateOptions.datepickerPopup = fsSpecificInteractiveJson['dateFormat'];
        };
        if (fsSpecificInteractiveJson['options']) {
            templateOptions.options = angularFormlyArrayForOptions(fsSpecificInteractiveJson['options']);
            
            if (fsSpecificInteractiveJson['defaultOption']) {
                //TODO: tempalte does not support this feature, yet
            };
        };

        return templateOptions;
    }; 

    var angularFormlyArrayForOptions = function(fsOptionsArray) {
        var afOptionsArray = [];
        // console.log("Transform OPTIONS");
        // console.log(fsOptionsArray);

        for (var optionIndex in fsOptionsArray) {
            var option = fsOptionsArray[optionIndex];
            var afOptionJson = {};
            afOptionJson.name = option.label;
            afOptionJson.value = option.id;
            afOptionsArray.push(afOptionJson);
        };

        return afOptionsArray;  
    };

    return JT;
}]);