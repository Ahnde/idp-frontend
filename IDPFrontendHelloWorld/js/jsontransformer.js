formularGenerator.factory("jsonTransformer", [function () {

    var JT = {};

    var angularFormlyJSONArray = [];

    JT.transformFormularSpecificationToAngularFormlyJSON = function(formularSpecification) {
        console.log("Transforming JSON:");
        console.log(formularSpecification);
        console.log("");
        
        console.log("--------");
        var angularFormlyJSON = {};
        angularFormlyJSON = generateAngularFormlyJSON(formularSpecification);
        console.log("--------");

        // var staticAngularFormlyJSON = new Object();
        // staticAngularFormlyJSON.key = "username";
        // staticAngularFormlyJSON.type = "input";
        // staticAngularFormlyJSON.templateOptions = {};
        // staticAngularFormlyJSON.templateOptions.label = "Username";
        // staticAngularFormlyJSON.templateOptions.placeholder = "John Doe";
        // staticAngularFormlyJSON.templateOptions.required = true;
        // staticAngularFormlyJSON.templateOptions.description = "The description";

        // var staticAngularFormlyJSON2 = new Object();
        // staticAngularFormlyJSON2.key = "username2";
        // staticAngularFormlyJSON2.type = "input";
        // staticAngularFormlyJSON2.templateOptions = {};
        // staticAngularFormlyJSON2.templateOptions.label = "Username2";
        // staticAngularFormlyJSON2.templateOptions.placeholder = "John Doe2";
        // staticAngularFormlyJSON2.templateOptions.required = true;
        // staticAngularFormlyJSON2.templateOptions.description = "The description2";

        // var myArray = [staticAngularFormlyJSON, staticAngularFormlyJSON2]
        // var myArray2 = [{"key": "text","type": "input","templateOptions": {"label": "Text","placeholder": "Type here to see the other field become enabled..."}},{"key": "text2","type": "input","templateOptions": {"label": "Hey!","placeholder": "This one is disabled if there is no text in the other input"},"expressionProperties": {"templateOptions.disabled": "!model.text"}}];
        // var myArray3 =[{"key": "username","type": "input","templateOptions": {"label": "Username","placeholder": "johndoe","required": true,"description": "Descriptive text"}}, {"key": "password","type": "input","templateOptions": {"type": "password","label": "Password","required": true},"expressionProperties": {"templateOptions.disabled": "!model.username"}}]

        console.log("");
        console.log("The transformed JSON:");
        // console.log(staticAngularFormlyJSON);
        // console.log(angularFormlyJSON);
        console.log(angularFormlyJSONArray);
        console.log("");

        // return myArray3;
        // return staticAngularFormlyJSON;

        // return angularFormlyJSONArray['0'];
        return angularFormlyJSONArray;
        return angularFormlyJSON;
    }

/*

parseGroup(json)
{
    var ret = {};
    var children = json['children'];
    ret.fields = [];
    for(c in children)
    {
        ret.fields.append(parseChild(c));
    }

    ret.xy = json['asdas'];
    return ret;
}
*/


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
                console.log("No match for generating JSON found.");
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
            returnJSON = generateAngularFormlyJSONForInteractiveArray(originalQuestionJSON['interactive']);
        };

        returnJSON.templateOptions.description = originalQuestionJSON.description[0]['content'];
        angularFormlyJSONArray.push(returnJSON);
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
            console.log(originalInteractiveJSONArray[i].interactive['type']);
            
            if (originalInteractiveJSONArray[i].interactive['type'] === "textfield") {
                console.log("The interactive element is a textfield:");
                console.log(originalInteractiveJSONArray[i].interactive);
                returnJSON = transformInput(originalInteractiveJSONArray[i].interactive);
            };
        };

        return returnJSON;
    };

    var transformLabel = function(originalLabelJSON) {
        var returnJSON = {};
        console.log("Transform LABEL-JSON");
        return returnJSON;
    };

    var transformInput = function(originalInputJSON) {
        var returnJSON = {};

        returnJSON.key = originalInputJSON['mapping-key'];
        returnJSON.type = "input";
        returnJSON.templateOptions = {};
        returnJSON.templateOptions.label = originalInputJSON.textfield['label'];
        returnJSON.templateOptions.placeholder = originalInputJSON.textfield['placeholder'];
        returnJSON.templateOptions.required = (originalInputJSON.validators['required'] === true)?true:false;
        // returnJSON.templateOptions.description = originalInputJSON.textfield['textfieldtype'];

        console.log("The transformed input JSON:");
        console.log(returnJSON);

        // angularFormlyJSONArray.push(returnJSON);

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









