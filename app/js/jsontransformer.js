formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {
        console.log("Transforming Json:");
        console.log(formularSpecification);
        console.log("");

        var formularSpecificationArray = formularSpecification.properties['children'].items;
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

        var json = JSON.stringify(angularFormlyJsonArray);
        console.log(json);
        // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(json);
        // window.open(url, '_blank');
        // window.focus();

        return angularFormlyJsonArray;
    };

    var angularFormlyJsonArrayForFsJson = function(fsJson) {
        console.log("Generate angular formly Json for Json:");
        console.log(fsJson);

        var afJsonArray = [];
        
        if (fsJson.properties.hasOwnProperty("group")) {
            console.log("Found GROUP");
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForGroup(fsJson.properties.group));
        } else if(fsJson.properties.hasOwnProperty("question")) {
            console.log("found QUESTION");
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForQuestion(fsJson.properties.question));
        } else {
            console.log("No match for generating Json found.");
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForGroup = function(fsGroupJson) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for GROUP:");
        console.log(fsGroupJson);

        //TODO add groupspecific attributes to angularFormlyJsonArray
        var fsGroupJsonArray = fsGroupJson.properties['children'].items;

        for (var i in fsGroupJsonArray) {
            console.log("Call again angularFormlyJsonArrayForFsJson with groups child element:");
            console.log(fsGroupJsonArray[i]);
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForFsJson(fsGroupJsonArray[i]));
        };
        
        return afJsonArray;
    };

    var angularFormlyJsonArrayForQuestion = function(fsQuestionJson) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for QUESTION:");
        console.log(fsQuestionJson);

        //TODO add questionspecific attributes to angularFormlyJsonArray

        if (fsQuestionJson.properties['interactive']) {
            console.log("The question contains an interactive element:");
            console.log(fsQuestionJson.properties['interactive']);
            afJsonArray = angularFormlyJsonArrayForInteractive(fsQuestionJson.properties['interactive']);
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForInteractive = function(fsInteractiveJson) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for INTERACTIVE:");
        console.log(fsInteractiveJson);
        
        //TODO add interactivespecific attributes to angularFormlyJsonArray

        var fsInteractiveJsonArray = fsInteractiveJson.items;

        for (var i in fsInteractiveJsonArray) {
            var currentFsInteractiveJson = fsInteractiveJsonArray[i].properties['interactive'];

            var afJson = {};

            afJson.key = currentFsInteractiveJson.properties['mapping-key'].id;

            var fsJsonTypeString = currentFsInteractiveJson.properties.elementType['elementValue'];
            afJson.type = angularFormlyTypeStringForFsTypeString(fsJsonTypeString);

            if (fsJsonTypeString === 'date') {
                console.log("no af-template for the calendar-picker implemented yet");
                break; //no af-template for the calendar-picker implemented yet
            };

            var fsSpecificInteractiveJson = currentFsInteractiveJson.properties[fsJsonTypeString];
            afJson.templateOptions = templateOptionsForInteractiveFsJson(fsSpecificInteractiveJson);

            if (fsJsonTypeString === 'date') {
                console.log("no af-template for the calendar-picker implemented yet");
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

    var templateOptionsForInteractiveFsJson = function(fsSpecificInteractiveJson){
        var templateOptions = {};
        templateOptions.label = fsSpecificInteractiveJson.properties['label'].elementValue;
        if (fsSpecificInteractiveJson.properties['placeholder']) {
            templateOptions.placeholder = fsSpecificInteractiveJson.properties['placeholder'].elementValue;
        };
        if (fsSpecificInteractiveJson.properties['options']) {
            templateOptions.options = angularFormlyArrayForOptions(fsSpecificInteractiveJson.properties['options']);
        };

        return templateOptions;
    }; 

    var angularFormlyArrayForOptions = function(fsOptions) {
        var afOptionsArray = [];
        console.log("Transform OPTIONS");
        console.log(fsOptions);

        var fsOptionsArray = fsOptions['items'];

        for (var optionIndex in fsOptionsArray) {
            var option = fsOptionsArray[optionIndex].properties['option'].properties;

            var afOptionJson = {};
            afOptionJson.name = option.label.elementValue;
            afOptionJson.value = option.id.elementValue;
            afOptionsArray.push(afOptionJson);
        };

        return afOptionsArray;  
    };

    return JT;
}]);