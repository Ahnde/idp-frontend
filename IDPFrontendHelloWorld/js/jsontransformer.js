formularGenerator.factory("jsonTransformer", [function () {

    var JT = {};

    var angularFormlyJSONArray = [];
    
    JT.transformFormularSpecificationToAngularFormlyJSON = function(formularSpecification) {
        console.log("Transforming JSON:");
        console.log(formularSpecification);
        console.log("");
        
        console.log("--------");
        // angularFormlyJSONArray.push("Start");
        generateAngularFormlyJSON(formularSpecification);
        // angularFormlyJSONArray.push("End");
        var angularFormlyJSON = angularFormlyJSONArray;
        console.log("--------");

        var staticAngularFormlyJSON = new Object();
        staticAngularFormlyJSON.key = "username";
        staticAngularFormlyJSON.type = "input";
        staticAngularFormlyJSON.templateOptions = {};
        staticAngularFormlyJSON.templateOptions.label = "Username";
        staticAngularFormlyJSON.templateOptions.placeholder = "John Doe";
        staticAngularFormlyJSON.templateOptions.required = true;
        staticAngularFormlyJSON.templateOptions.description = "The description";

        console.log("");
        console.log("The transformed JSON:");
        // console.log(staticAngularFormlyJSON);
        console.log(angularFormlyJSON);
        console.log("");
        // return staticAngularFormlyJSON;


        return angularFormlyJSON['0'];
    }
    

    // var generateAngularFormlyJSON = function(originalJSON) {
    //     for(var i in originalJSON) {
    //         if ((i === "interactive") && (Object.prototype.toString.call(originalJSON[i]) != "[object Array]")) {
    //             console.log("Found an interactive element.");
    //             console.log(originalJSON[i]);
    //             var angularFormlyJSONInteractiveElement = transformInput(originalJSON[i]);
    //             angularFormlyJSONArray.push(angularFormlyJSONInteractiveElement);
    //         } else if ((i === "somethingElse") && (Object.prototype.toString.call(originalJSON[i]) != "[object Array]")) {
    //             //TODO
    //         } else 
    //         if ( (typeof originalJSON[i] === "object") && (originalJSON[i] !== null) ) {
    //             // console.log("This part of the JSON is an object. Therefore, generate the formly JSON for this part.");
    //             var found = generateAngularFormlyJSON(originalJSON[i]);
    //         } 
    //         else {
    //             // console.log("No match for generating JSON found.")
    //         }
    //     }
    // };

    var generateAngularFormlyJSON = function(originalJSON) {
        console.log("Generate angular formly JSON for JSON:");
        console.log(originalJSON);
        for(var i in originalJSON) {
            if ((i === "group") && (Object.prototype.toString.call(originalJSON[i]) != "[object Array]")) {
                console.log("Found GROUP in JSON");
                generateAngularFormlyJSONForGroup(originalJSON.group);
            } else if ((i === "question") && (Object.prototype.toString.call(originalJSON[i]) != "[object Array]")) {
                console.log("found question");
                generateAngularFormlyJSONForQuestion(originalJSON.question);
            } else {
                console.log("No match for generating JSON found.")
            }
        }
    };

    var generateAngularFormlyJSONForGroup = function(originalGroupJSON) {
        var returnJSON = {};
        console.log("Generate angular formly JSON for GROUP:");
        console.log(originalGroupJSON);
        //TODO add groupspecific attributes to angularFormlyJSONArray
        console.log(originalGroupJSON.children);
        for (var i in originalGroupJSON.children) {
            console.log("Call again generateAngularFormlyJSON with groups child element:");
            console.log(originalGroupJSON.children[i]);
            generateAngularFormlyJSON(originalGroupJSON.children[i]);
        };
        
        return returnJSON;
    };

    var generateAngularFormlyJSONForQuestion = function(originalQuestionJSON) {
        var returnJSON = {};
        console.log("Generate angular formly JSON for QUESTION:");
        console.log(originalQuestionJSON);
        //TODO add questionspecific attributes to angularFormlyJSONArray
        if (originalQuestionJSON['interactive']) {
            console.log("The question contains an interactive element:");
            console.log(originalQuestionJSON['interactive']);
            generateAngularFormlyJSONForInteractiveArray(originalQuestionJSON['interactive']);
        };

        return returnJSON;
    };

    var generateAngularFormlyJSONForInteractiveArray = function(originalInteractiveJSONArray) {
        var returnJSON = {};
        console.log("Generate angular formly JSON for INTERACTIVE:");
        console.log(originalInteractiveJSONArray);
        //TODO add interactivespecific attributes to angularFormlyJSONArray
        for (var i in originalInteractiveJSONArray) {
            console.log("Checking for the type of the interactive element:");
            console.log(originalInteractiveJSONArray[i]);
            console.log(originalInteractiveJSONArray[i]['type']);
            console.log(originalInteractiveJSONArray[i].type);
            console.log(originalInteractiveJSONArray.i['type']);
            console.log(originalInteractiveJSONArray.i.type);
            
            if ((originalInteractiveJSONArray[i]['type'] === "textfield") && (Object.prototype.toString.call(originalJSON[i]) != "[object Array]")) {
                console.log("The interactive element is a textfield:");
                transformInput(originalInteractiveJSONArray[i]);
            };
        };
        return returnJSON;
    };

    var transformLabel = function(originalLabelJSON) {
        var returnJSON = {};
        console.log("LABEL");
        return returnJSON;
    };

    var transformInput = function(originalInputJSON) {
        var returnJSON = {};
        console.log("INPUT");

        returnJSON.key = originalJSON['mapping-key'];
        returnJSON.type = "input";
        returnJSON.templateOptions = {};
        returnJSON.templateOptions.label = originalJSON.textfield['textfieldtype'];
        returnJSON.templateOptions.placeholder = originalJSON.textfield['placeholder'];
        returnJSON.templateOptions.required = (originalJSON.validators['required'] === true)?true:false;
        returnJSON.templateOptions.description = originalJSON.textfield['textfieldtype'];

        console.log("The transformed input JSON:");
        console.log(returnJSON);

        return returnJSON;
    };

    var transformCheckbox = function(originalCheckboxJSON) {
        var returnJSON = {};
        return returnJSON;
    };

    var transformDropdown = function(originalDropdownJSON) {
        var returnJSON = {};
        return returnJSON;
    };


    return JT;
}]);

/*
[{
    "key": "username",
    "type": "input",
    "templateOptions": {
        "label": "Username",
        "placeholder": "johndoe",
        "required": true,
        "description": "Descriptive text"
    }
}, 
{
    "key": "password",
    "type": "input",
    "templateOptions": {
        "type": "password",
        "label": "Password",
        "required": true
    },
    "expressionProperties": {
        "templateOptions.disabled": "!model.username"
    }
}]

*/



// group
//     description
//         content
//         type
//     type
//     children []
//         question
//             id
//             type
//             description
//                 content
//                 type
//             interactive []
//                 interactive
//                     type
//                     mapping-key
//                     validators
//                     textfieldtype
//                     placeholder









