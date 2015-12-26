formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecificationArray) {
        console.log("Transforming Json:");
        console.log(formularSpecificationArray);
        console.log("");

        var angularFormlyJsonArray = [];

        for (var objectNumber in formularSpecificationArray) {
            var currentFsJson = formularSpecificationArray[objectNumber];
            var currentAfArray = angularFormlyJsonArrayForFsJson(currentFsJson);
            angularFormlyJsonArray = angularFormlyJsonArray.concat(currentAfArray);
        };

        console.log("");
        console.log("The array with the transformed Json:");
        console.log(angularFormlyJsonArray);
        console.log("");

        return angularFormlyJsonArray;
    };

    var angularFormlyJsonArrayForFsJson = function(fsJson) {
        console.log("Generate angular formly Json for Json:");
        console.log(fsJson);

        var afJsonArray = [];
        var afJson = {};

        for(var i in fsJson) {
            if ((i === "group") && (Object.prototype.toString.call(fsJson[i]) != "[object Array]")) {
                console.log("Found GROUP in Json");
                afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForGroup(fsJson.group));
            } else if ((i === "question") && (Object.prototype.toString.call(fsJson[i]) != "[object Array]")) {
                console.log("found question");
                afJsonArray = afJsonArray.concat(angularFormlyJsonForQuestion(fsJson.question));
            } else {
                console.log("No match for generating Json found.");
            }
        
        }

        return afJsonArray;
    };

    var angularFormlyJsonArrayForGroup = function(fsGroupJson) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for GROUP:");
        console.log(fsGroupJson);

        //TODO add groupspecific attributes to angularFormlyJsonArray

        for (var i in fsGroupJson.children) {
            console.log("Call again angularFormlyJsonArrayForFsJson with groups child element:");
            console.log(fsGroupJson.children[i]);
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForFsJson(fsGroupJson.children[i]));
        };
        
        return afJsonArray;
    };

    var angularFormlyJsonForQuestion = function(originalQuestionJson) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for QUESTION:");
        console.log(originalQuestionJson);

        //TODO add questionspecific attributes to angularFormlyJsonArray

        if (originalQuestionJson['interactive']) {
            console.log("The question contains an interactive element:");
            console.log(originalQuestionJson['interactive']);
            afJsonArray = angularFormlyJsonArrayForInteractive(originalQuestionJson['interactive']);
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForInteractive = function(fsInteractiveJsonArray) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for INTERACTIVE:");
        console.log(fsInteractiveJsonArray);
        
        //TODO add interactivespecific attributes to angularFormlyJsonArray
        
        for (var i in fsInteractiveJsonArray) {
            var fsInteractiveJson = fsInteractiveJsonArray[i].interactive;

            var afJson = {};

            afJson.key = fsInteractiveJson['mapping-key'];
            afJson.type = angularFormlyTypeStringForFsTypeString(fsInteractiveJson['type']);


            var jsSpecificInteractiveJson = fsInteractiveJson[fsInteractiveJson['type']];
            afJson.templateOptions = templateOptionsForInteractiveFsJson(jsSpecificInteractiveJson);

            if (afJson.type === 'date') {
                break; //no af-template for the calendar-picker implemented yet
            };

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
                    return "date";
                default:
                    return "not a valid type";
        }
    };

    var templateOptionsForInteractiveFsJson = function(jsSpecificInteractiveJson){
        console.log(jsSpecificInteractiveJson);

        var templateOptions = {};
        templateOptions.label = jsSpecificInteractiveJson['label'];
        templateOptions.placeholder = jsSpecificInteractiveJson['placeholder'];
        templateOptions.options = angularFormlyArrayForOptions(jsSpecificInteractiveJson['options']);

        return templateOptions;
    }; 

    var angularFormlyArrayForOptions = function(fsOptionsArray){
        var afOptionsArray = [];
        console.log("Transform OPTIONS");

        for (var optionIndex in fsOptionsArray) {
            var option = fsOptionsArray[optionIndex].option;
            console.log(option.label);

            var afOptionJson = {};
            afOptionJson.name = option.label;
            afOptionJson.value = option.id;
            afOptionsArray.push(afOptionJson);
        };

        return afOptionsArray;  
    };

    return JT;
}]);