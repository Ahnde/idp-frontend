formularGenerator.factory("jsonTransformer", [function () {

    var JT = {};

    JT.transformFormularSpecificationToAngularFormlyJson = function(formularSpecification) {
        console.log("Transforming Json:");
        console.log(formularSpecification);
        console.log("");
        
        console.log("--------");
        var angularFormlyJsonArray = angularFormlyJsonArrayForFsJson(formularSpecification);
        console.log("--------");

        console.log("");
        console.log("The array with the transformed Json:");
        console.log(angularFormlyJsonArray);
        console.log("");

        return angularFormlyJsonArray;
    }

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

    var angularFormlyJsonArrayForInteractive = function(originalInteractiveJsonArray) {
        var afJsonArray = [];

        console.log("Generate angular formly Json for INTERACTIVE:");
        console.log(originalInteractiveJsonArray);
        
        //TODO add interactivespecific attributes to angularFormlyJsonArray
        
        for (var i in originalInteractiveJsonArray) {
            console.log("Checking for the type of the interactive element:");
            console.log(originalInteractiveJsonArray[i].interactive['type']);
            
            if (originalInteractiveJsonArray[i].interactive['type'] === "textfield") {
                afJsonArray.push(angularFormlyJsonForInputfield(originalInteractiveJsonArray[i].interactive));
            };
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

        var validators = fsInputJson.validators;
        for (var validatorIndex in validators) {
            var validator = validators[validatorIndex];
            if (validator === 'required') {
                templateOptions.required = (validators[validatorIndex] === true)?true:false;
            };
        };
        
        // templateOptions.description = fsInputJson.textfield['description'];
        return templateOptions;
    }

    var angularFormlyJsonForCheckbox = function(fsCheckboxJson) {
        var afJson = {};
        return afJson;
    };

    var angularFormlyJsonForDropdown = function(fsDropdownJson) {
        var afJson = {};
        return afJson;
    };


    return JT;
}]);