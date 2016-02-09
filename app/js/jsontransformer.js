formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {
        var formularSpecificationArray = formularSpecification['children'];
        var angularFormlyJsonArray = [];

        for (var objectNumber in formularSpecificationArray) {
            var currentFsJson = formularSpecificationArray[objectNumber];
            var currentAfArray = angularFormlyJsonArrayForFsJson(currentFsJson);
            angularFormlyJsonArray = angularFormlyJsonArray.concat(currentAfArray);
        };

        // var json = JSON.stringify(angularFormlyJsonArray);
        // console.log(json);
        // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(json);
        // window.open(url, '_blank');
        // window.focus();

        return angularFormlyJsonArray;
    };

    var angularFormlyJsonArrayForFsJson = function(fsJson) {

        var afJsonArray = [];
        
        if (fsJson['elementType'] === "group") {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForGroup(fsJson));
        } else if(fsJson['elementType'] === "question") {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForQuestion(fsJson));
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForGroup = function(fsGroupJson) {
        var afJsonArray = [];

        var fsGroupDescriptionsArray = fsGroupJson['descriptions']
        if (fsGroupDescriptionsArray.length > 0)
        {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForDescriptions(fsGroupDescriptionsArray));
        }

        var fsGroupChildrenArray = fsGroupJson['children'];

        for (var i in fsGroupChildrenArray) {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForFsJson(fsGroupChildrenArray[i]));
        };
        
        return afJsonArray;
    };

    var angularFormlyJsonArrayForQuestion = function(fsQuestionJson) {
        var afJsonArray = [];

        var fsQuestionDescriptionsArray = fsQuestionJson['descriptions']
        if (fsQuestionDescriptionsArray.length > 0)
        {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForDescriptions(fsQuestionDescriptionsArray));
        }

        if (fsQuestionJson['interactives']) {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForInteractive(fsQuestionJson['interactives']));
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForDescriptions = function(fsDescriptionJsonArray) {
        var afJsonArray = [];

        for (var i in fsDescriptionJsonArray)
        {
            var fsDescription = fsDescriptionJsonArray[i];
            afJsonArray = afJsonArray.concat(angularFormlyJsonAForDescription(fsDescription))
        }

        return afJsonArray;
    }

    var angularFormlyJsonAForDescription = function(fsDescriptionJson) {
        var afJson = {};
        var templateOptions = {};

        if (fsDescriptionJson['descriptionType'] === "image") {
            afJson.type = "image";
            templateOptions.url = fsDescriptionJson['content'];
        } else {
            afJson.type = "textlabel";
            templateOptions.label = fsDescriptionJson['content'];
        };

        afJson.templateOptions = templateOptions;

        return afJson;
    }

    var angularFormlyJsonArrayForInteractive = function(fsInteractiveJsonArray) {
        var afJsonArray = [];

        for (var i in fsInteractiveJsonArray) {
            var currentFsInteractiveJson = fsInteractiveJsonArray[i];

            var afJson = {};

            var fsJsonTypeString = currentFsInteractiveJson['elementType'];
            if (fsJsonTypeString === 'error') {
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