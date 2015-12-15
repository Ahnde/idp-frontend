formularGenerator.factory("jsonTransformer", [function () {

    "use strict";
    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecificationArray) {
        console.log("Transforming Json:");
        console.log(formularSpecificationArray);
        console.log("");

        var angularFormlyJsonArray = [];

        for (var objectNumber in formularSpecificationArray) {
            var currentJsJson = formularSpecificationArray[objectNumber];
            var currentAfArray = angularFormlyJsonArrayForFsJson(currentJsJson);
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

            console.log("Checking for the type of the interactive element:");
            console.log(fsInteractiveJson['type']);

            switch (fsInteractiveJson['type']) {
                case "textfield":
                    afJsonArray.push(angularFormlyJsonForInputfield(fsInteractiveJson));
                    break;
                case "checkbox":
                    afJsonArray.push(angularFormlyJsonForCheckbox(fsInteractiveJson));
                    break;
                case "radio":
                    afJsonArray.push(angularFormlyJsonForRadio(fsInteractiveJson));
                    break;
                case "dropdown":
                    afJsonArray.push(angularFormlyJsonForDropdown(fsInteractiveJson));
                    break;
                case "date":
                    // afJsonArray.push(angularFormlyJsonForDate(fsInteractiveJson));
                    break;
                default:
                    break;
            }
        };

        return afJsonArray;
    };

    var angularFormlyJsonForLabel = function(fsLabelJson) {
        var afJson = {};
        console.log("Transform LABEL-Json");
        return afJson;
    };

    var angularFormlyJsonForInputfield = function(fsInputJson) {
        var afJson = {};

        console.log("Transform INPUT-Json");

        afJson.key = fsInputJson['mapping-key'];
        afJson.type = "input";
        afJson.templateOptions = templateOptionsForInputJson(fsInputJson);

        console.log("The transformed input Json:");
        console.log(afJson);

        return afJson;
    };

    var templateOptionsForInputJson = function(fsInputJson) {
        var templateOptions = {}

        templateOptions.label = fsInputJson.textfield['label'];
        templateOptions.placeholder = fsInputJson.textfield['placeholder'];
        
        // templateOptions.description = fsInputJson.textfield['description'];
        return templateOptions;
    };

    var angularFormlyJsonForCheckbox = function(fsCheckboxJson) {
        var afJson = {};
        console.log("Transform CHECKBOX-Json");
        
        afJson.key = fsCheckboxJson['mapping-key'];
        afJson.type = "checkbox";
        afJson.templateOptions = templateOptionsForCheckboxJson(fsCheckboxJson);

        console.log("The transformed checkbox Json:");
        console.log(afJson);

        return afJson;
    };

    var templateOptionsForCheckboxJson = function(fsCheckboxJson) {
        var templateOptions = {}

        templateOptions.label = fsCheckboxJson.checkbox['label'];
        templateOptions.placeholder = fsCheckboxJson.checkbox['placeholder'];
        
        // templateOptions.description = fsCheckboxJson.checkbox['description'];
        return templateOptions;
    };

    var angularFormlyJsonForRadio = function(fsRadioJson) {
        var afJson = {};
        console.log("Transform RADIO-Json");

        afJson.key = fsRadioJson['mapping-key'];
        afJson.type = "radio";
        afJson.templateOptions = templateOptionsForRadioJson(fsRadioJson);

        console.log("The transformed radio Json:");
        console.log(afJson);

        return afJson;
    };

     var templateOptionsForRadioJson = function(fsRadioJson) {
        var templateOptions = {}

        templateOptions.label = fsRadioJson.radio['label'];
        templateOptions.placeholder = fsRadioJson.radio['placeholder'];
        templateOptions.options = angularFormlyArrayForOptions(fsRadioJson.radio['options']);

        // templateOptions.description = fsRadioJson.radio['description'];
        return templateOptions;
    };

    var angularFormlyJsonForDropdown = function(fsDropdownJson) {
        var afJson = {};
        console.log("Transform DROPDOWN-Json");
        
        afJson.key = fsDropdownJson['mapping-key'];
        afJson.type = "select";
        afJson.templateOptions = templateOptionsForDropdownJson(fsDropdownJson);

        console.log("The transformed dropdown Json:");
        console.log(afJson);

        return afJson;
    };

    var templateOptionsForDropdownJson = function(fsDropdownJson) {
        var templateOptions = {}

        templateOptions.label = fsDropdownJson.dropdown['label'];
        templateOptions.placeholder = fsDropdownJson.dropdown['placeholder'];
        templateOptions.options = angularFormlyArrayForOptions(fsDropdownJson.dropdown['options']);

        // templateOptions.description = fsRadioJson.radio['description'];
        return templateOptions;
    };

    var angularFormlyJsonForDate = function(fsDateJson) {
        var afJson = {};
        console.log("Transform DATE-Json");

        return afJson;
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