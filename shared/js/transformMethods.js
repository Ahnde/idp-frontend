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

        afJson.type = angularFormlyTypeStringForDescriptionFsTypeString(fsDescriptionJson['descriptionType']);
        afJson.templateOptions = templateOptionsForDescriptionFsJson(fsDescriptionJson);;

        return afJson;
    }

    var angularFormlyJsonArrayForInteractive = function(fsInteractiveJsonArray) {
        var afJsonArray = [];

        var currentFsInteractiveJson,
            afJson,
            fsJsonTypeString,
            fsSpecificInteractiveJson,
            fsValidatorsJsonArray,
            templateOptions;

        for (var i in fsInteractiveJsonArray) {
             currentFsInteractiveJson = fsInteractiveJsonArray[i];

            afJson = {};

            fsJsonTypeString = currentFsInteractiveJson['elementType'];
            if (fsJsonTypeString === 'error') {
                continue;
            };

            afJson.type = angularFormlyTypeStringForInteractiveFsTypeString(fsJsonTypeString);

            afJson.key = currentFsInteractiveJson['mappingKey'];

            fsSpecificInteractiveJson = currentFsInteractiveJson['interactiveDetails'];
            templateOptions = templateOptionsForInteractiveFsJson(fsSpecificInteractiveJson);
            afJson.templateOptions = templateOptions;

            if (currentFsInteractiveJson['validators'].length > 0) {
                fsValidatorsJsonArray = currentFsInteractiveJson['validators'];
                validatorsForFsJsonArray(fsValidatorsJsonArray, templateOptions, function(callbackTemplateOptions, callbackValidators, callbackExpressionProperties) {
                    afJson.templateOptions = callbackTemplateOptions;
                    afJson.validators = callbackValidators;
                    afJson.expressionProperties = callbackExpressionProperties;
                });
            }

            afJsonArray.push(afJson);
        };

        return afJsonArray;
    };

    var angularFormlyTypeStringForDescriptionFsTypeString = function(fsTypeString) {
        var afTypeString;

        switch (fsTypeString) {
                case "image":
                    afTypeString = "image";
                    break;
                case "video":
                    afTypeString = "video";
                    break;
                case "text":
                    afTypeString = "textlabel";
                    break;
                default:
                    afTypeString = "error";
                    break;
        }

        return afTypeString;
    };

    var angularFormlyTypeStringForInteractiveFsTypeString = function(fsTypeString) {
        var afTypeString;

        switch (fsTypeString) {
                case "textfield":
                    afTypeString = "input";
                    break;
                case "checkbox":
                    afTypeString = "checkbox";
                    break;
                case "radio":
                    afTypeString = "radio";
                    break;
                case "dropdown":
                    afTypeString = "select";
                    break;
                case "date":
                    afTypeString = "datepicker";
                    break;
                default:
                    afTypeString = "error";
                    break;
        }

        return afTypeString;
    };

    var validatorsForFsJsonArray = function(fsValidatorsArray, oldTemplateOptions, callback) {
        var validators = {};
        var templateOptions = {};
        var expressionProperties = {};

        templateOptions = oldTemplateOptions;

        var oneValidator;
        for (var validatorIndex in fsValidatorsArray) {
            oneValidator = fsValidatorsArray[validatorIndex];
            if (oneValidator['isRequired']) {
                templateOptions.required = true;
            }
            if (oneValidator['minLength']) {
                templateOptions.minLength = oneValidator['minLength'];
            }
            if (oneValidator['maxLength']) {
                templateOptions.maxLength = oneValidator['maxLength'];
            }
        }

        callback(templateOptions, validators, expressionProperties);
        return validators;
    };

    var templateOptionsForDescriptionFsJson = function(fsDescriptionJson) {
        var templateOptions = {};

        if (fsDescriptionJson['text']) {
            templateOptions.label = fsDescriptionJson['text'];
        }

        if (fsDescriptionJson['urls']) {
            var urls = fsDescriptionJson['urls'];
            var oneUrl;
            var urlString;
            for (var urlIndex in urls) {
                oneUrl = urls[urlIndex];
                urlString = "url" + urlIndex;
                templateOptions[urlString] = oneUrl;
            }
        }

        return templateOptions;
    };

    var templateOptionsForInteractiveFsJson = function(fsSpecificInteractiveJson) {
        var templateOptions = {};

        templateOptions.label = fsSpecificInteractiveJson['label'];

        if (fsSpecificInteractiveJson['length']) {
            //TODO: tempalte does not support this feature, yet
        }
        if (fsSpecificInteractiveJson['placeholder']) {
            templateOptions.placeholder = fsSpecificInteractiveJson['placeholder'];
            // templateOptions.required = true;
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



/*
 *
 * INTERACTIVE_DETAIL = {
 * (label: STRING, )?
 * (post_label: STRING, )?
 * (length: INTEGER, )?
 * (placeholder: STRING, )?
 * (input_type: INPUT_TYPE, )?
 * (date_format: DATE_FORMAT, )?
 * (options: [OPTION +], )?
 * (default_option: INTEGER )?
 * }
 */
var parseInteractiveDetails = function(angSpec)
{
  var details = [];
  var detail = {
    "placeholder" : angSpec["placeholder"],
    "label" : angSpec["label"]
  };

  details.push(detail);
  return details;
};

/*
 *
 * INTERACTIVE = {
 * element_id: ID,
 * interactive_type: INTERACTIVE_TYPE,
 * mapping_key : MAPPING_KEY,
 * validators: [VALIDATOR +],
 * interactive_details: [INTERACTIVE_DETAIL *]
 * }
 *
 */
var parseInteractive = function(angSpec)
{
  var interactive = {
    "element_id": getID(),
    "element_type": "input",
    "mapping_key":angSpec["key"],
    "validators":[],
    "interactive_details":parseInteractiveDetails(angSpec["templateOptions"])
  };
  return interactive;
};

//[INTERACTIVE *]
var parseInteractives = function(angSpec)
{
  var interactives = [];
  var interactive = parseInteractive(angSpec);
  interactives.push(interactive);
  return interactives;

};

//GROUP = { element_id: ID, element_type: "group", descriptions: [DESCRIPTION *], children:[CHILD +], repeatable : BOOL}
var parseGroup = function(angSpec) { }; //todo

//QUESTION = { element_id: ID, element_type: "question", descriptions: [DESCRIPTION *], interactives: [INTERACTIVE *] }
var parseQuestion = function(angSpec)
{
  var question = {
    "element_id" : getID(),
    "element_type":"question",
    "descriptions":[],
    "interactives":parseInteractives(angSpec)
  };
  return question;
};

//CHILD = QUESTION | GROUP
var parseChildren = function(angSpec)
{
  var children = [];
  for (var key in angSpec)
  {
    var child = parseQuestion(angSpec[key]);
    children.push(child);
  };
  return children;
};


//FORM =  { element_id: ID, element_type: "form", metadata : [FORM_METADATA *], descriptions: [DESCRIPTION *], children:[CHILD *] }
var idCounter = 0;
var getID = function()
{
  var id = idCounter+"";
  idCounter++;
  return id;
};
var parseForm = function(angSpec)
{

  var form = {
    "element_id" : getID(),
    "element_type" : "form",
    "metadata" : [],
    "description" : [],
    "children" : parseChildren(angSpec)
  };
  return form;
};

var formspecFromAngluar = function(angularSpec) {
  idCounter = 0;
  return parseForm(angularSpec);

};

