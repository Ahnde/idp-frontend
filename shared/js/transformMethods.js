    // FORMULAR DATA
    var jsonFromLabelAndData = function(dataLabel, formularData) {
        return{"label": dataLabel, "data":formularData};
    };

    // FORMULAR FORM
    var angularFromIDPSpec = function(formularSpecification) {
        var formularSpecificationArray = formularSpecification['children'];
        var angularFormlyJsonArray = [];

        for (var objectNumber in formularSpecificationArray) {
            var currentFsJson = formularSpecificationArray[objectNumber];
            var currentAfArray = angularFormlyJsonArrayForFsJson(currentFsJson);
            angularFormlyJsonArray = angularFormlyJsonArray.concat(currentAfArray);
        };

        return angularFormlyJsonArray;
    };

    var angularFormlyJsonArrayForFsJson = function(fsJson) {
        var afJsonArray = [];

        if (fsJson['element_type'] === "container") {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForContainer(fsJson));
        } else if(fsJson['element_type'] === "description") {
            afJsonArray.push(angularFormlyJsonForDescription(fsJson));
        } else if(fsJson['element_type'] === "interactive") {
            afJsonArray.push(angularFormlyJsonForInteractive(fsJson));
        };

        return afJsonArray;
    };

    var angularFormlyJsonArrayForContainer = function(fsContainerJson) {
        var afJsonArray = [];

        var fsContainerChildrenArray = fsContainerJson['children'];

        for (var i in fsContainerChildrenArray) {
            afJsonArray = afJsonArray.concat(angularFormlyJsonArrayForFsJson(fsContainerChildrenArray[i]));
        };

        return afJsonArray;
    };

    var angularFormlyJsonForDescription = function(fsDescriptionJson) {
        var afJson = {};

        afJson.type = angularFormlyTypeStringForDescriptionFsTypeString(fsDescriptionJson['description_type']);
        afJson.templateOptions = templateOptionsForDescriptionFsJson(fsDescriptionJson);;

        return afJson;
    }

    var angularFormlyJsonForInteractive = function(fsInteractiveJson) {
        
        fsJsonTypeString = fsInteractiveJson['interactive_type'];
        if (fsJsonTypeString === 'error') {
            return {};
        };

        var fsJsonTypeString,
            fsInteractiveDetailsJson,
            fsValidatorsJsonArray,
            templateOptions;

        var afJson = {};

        afJson.type = angularFormlyTypeStringForInteractiveFsTypeString(fsJsonTypeString);
        afJson.key = fsInteractiveJson['mapping_key'];

        fsInteractiveDetailsJson = fsInteractiveJson['interactive_details'];
        templateOptions = templateOptionsForInteractiveFsJson(fsInteractiveDetailsJson);
        afJson.templateOptions = templateOptions;

        if (fsInteractiveJson['validators'].length > 0) {
            fsValidatorsJsonArray = fsInteractiveJson['validators'];
            validatorsForFsJsonArray(fsValidatorsJsonArray, templateOptions, function(callbackTemplateOptions, callbackValidators, callbackExpressionProperties) {
                afJson.templateOptions = callbackTemplateOptions;
                afJson.validators = callbackValidators;
                afJson.expressionProperties = callbackExpressionProperties;
            });
        }
        return afJson;
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
                case "input":
                    afTypeString = "input";
                    break;
                case "textarea":
                    afTypeString = "textarea";
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

        var oneValidator,
            afValidator,
            theValidator;
        for (var validatorIndex in fsValidatorsArray) {
            oneValidator = fsValidatorsArray[validatorIndex];
            afValidator = validatorForFsJson(oneValidator);

            theValidator = {};
            theValidator.expression = afValidator['validatorExpression'];
            theValidator.message = afValidator['validatorMessage'];

            validators[afValidator['validatorName']] = theValidator;
        }

        callback(templateOptions, validators, expressionProperties);
    };

    var validatorForFsJson = function(fsValidator) {
        var afValidator = {};

        var validatorName,
            validatorExpression,
            validatorMessage;
        switch (fsValidator['validator_type']) {
            case "isRequired":
                validatorName = "isRequired";
                validatorExpression = '$viewValue != ""';
                // validatorExpression = expressionForValidator("([^\s]*)");
                validatorMessage = "This field is required";
                break;
            case "minLength":
                validatorName = "minLength";
                validatorExpression = expressionForValidator("([^\s]*)");
                validatorMessage = "The min length was exceeded";
                break;
            case "maxLength":
                validatorName = "maxLength";
                validatorExpression = expressionForValidator("([^\s]*)");
                validatorMessage = "The max length was exceeded";
                break;
            case "minDate":
                validatorName = "minDate";
                validatorExpression = expressionForValidator("([^\s]*)");
                validatorMessage = "The min date was exceeded";
                break;
            case "maxDate":
                validatorName = "maxDate";
                validatorExpression = expressionForValidator("([^\s]*)");
                validatorMessage = "The max date was exceeded";
                break;
            default:
                // custom
                validatorName = fsValidator['validator_name'];
                validatorExpression = expressionForValidator(fsValidator['expression']);
                validatorMessage = "The custom validation failed";
                break;
        }

        validatorMessage = fsValidator['message'];

        afValidator['validatorName'] = validatorName;
        afValidator['validatorExpression'] = validatorExpression;
        afValidator['validatorMessage'] = '"'+validatorMessage+'"';
        
        return afValidator;
    }

    var expressionForValidator = function(fsValidatorExpression) {
        var expressionFunction = function($viewValue, $viewModel, scope) {
            var regExp = new RegExp(fsValidatorExpression);
            var value = $viewValue || $viewModel;
            if (value) {
                return regExp.test(value);
            }
        };
        return expressionFunction;
    }

    var templateOptionsForDescriptionFsJson = function(fsDescriptionJson) {
        var templateOptions = {};

        if (fsDescriptionJson['text']) {
            templateOptions.label = fsDescriptionJson['text'];
        }

        if (fsDescriptionJson['urls']) {
            var fsUrls = fsDescriptionJson['urls'];
            var oneUrl;
            var afUrls = [];

            for (var urlIndex in fsUrls) {
                oneUrl = fsUrls[urlIndex];
                afUrls.push(oneUrl);
            }
            templateOptions.urls = afUrls;
        }

        return templateOptions;
    };

    var templateOptionsForInteractiveFsJson = function(fsInteractiveDetailsJson) {
        var templateOptions = {};

        templateOptions.label = fsInteractiveDetailsJson['label'];
        templateOptions.postLabel = fsInteractiveDetailsJson['post_label'];

        //textarea
        if (fsInteractiveDetailsJson['rows']) {
            templateOptions.rows = fsInteractiveDetailsJson['rows'];
        }
        if (fsInteractiveDetailsJson['columns']) {
            templateOptions.cols = fsInteractiveDetailsJson['columns'];
        }

        //input and textarea
        if (fsInteractiveDetailsJson['placeholder']) {
            templateOptions.placeholder = fsInteractiveDetailsJson['placeholder'];
            // templateOptions.required = true;
        };

        //input
        if (fsInteractiveDetailsJson['input_type']) {
            //TODO: template does not support this feature, yet
        }

        //date
        if (fsInteractiveDetailsJson['dateFormat']) {
            templateOptions.type = "text";
            templateOptions.datepickerPopup = fsInteractiveDetailsJson['dateFormat'];
        };

        //dropdown
        if (fsInteractiveDetailsJson['options']) {
            templateOptions.options = angularFormlyArrayForOptions(fsInteractiveDetailsJson['options']);

            if (fsInteractiveDetailsJson['defaultOption']) {
                //TODO: template does not support this feature, yet
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
            afOptionJson.value = option.element_id;
            afOptionsArray.push(afOptionJson);
        };

        return afOptionsArray;
    };



//not in use anymore...

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

