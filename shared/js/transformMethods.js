    var formScope;

    // FORMULAR DATA
    var formularDataFromMetadataAndContent = function(formId, title, formularContent) {
        var metadata = {};
        metadata['data_id'] = "###REPLACE_DATA_ID###";
        metadata['form_id'] = formId;
        metadata['title'] = title;
        metadata['created_date'] = moment().format('llll');
        metadata['modified_date'] = moment().format('llll');

        var formularData = {};

        formularData['element_type'] = "data";
        formularData['metadata'] = metadata;
        formularData['content'] = formularContent;
      
        return formularData;
    };

    var formularDataWithUpdatedMetadata = function(formularData, formularContent){
        formularData.metadata['modified_date'] = moment().format('llll');
        formularData.content = formularContent;
        return formularData;
    };

    // FORMULAR FORM
    var angularFromIDPSpec = function(formularSpecification, scope) {
        var formularSpecificationArray = formularSpecification['children'];
        var angularFormlyJsonArray = [];

        formScope = scope;

        for (var objectNumber in formularSpecificationArray) {
            var currentFsJson = formularSpecificationArray[objectNumber];
            var currentAfArray = angularFormlyJsonArrayForFsJson(currentFsJson);
            angularFormlyJsonArray = angularFormlyJsonArray.concat(currentAfArray);
        };
		
		// console.log('Angular Formly JSON')
		// console.log(angularFormlyJsonArray)
		// console.log('')
        
		return angularFormlyJsonArray;
    };

    // CHECK FOR NODE-TYPE
    var angularFormlyJsonArrayForFsJson = function(fsJson) {
        var afJsonArray = [];

        if (fsJson['element_type'] === "container") {
            afJsonArray.push(angularFormlyJsonForContainer(fsJson));
        } else if(fsJson['element_type'] === "description") {
            afJsonArray.push(angularFormlyJsonForDescription(fsJson));
        } else if(fsJson['element_type'] === "interactive") {
            afJsonArray.push(angularFormlyJsonForInteractive(fsJson));
        };

        return afJsonArray;
    };
    
    // CONTAINER
    var angularFormlyJsonForContainer = function(fsContainerJson) {
        var afJsonContainer = {};
        
        afJsonContainer.key = fsContainerJson.element_id;
        afJsonContainer.templateOptions = {};
        afJsonContainer.templateOptions['label'] = fsContainerJson.label;
        afJsonContainer.templateOptions['fields'] = [];
        afJsonContainer.templateOptions['inline'] = fsContainerJson.display_inline?true:false;
        

        var afJsonArray = [];
        var fsContainerChildrenArray = fsContainerJson['children'];

        for (var i in fsContainerChildrenArray) {
            var oneElement = angularFormlyJsonArrayForFsJson(fsContainerChildrenArray[i]);
            afJsonArray = afJsonArray.concat(oneElement);
        };

        afJsonContainer.templateOptions['fields'] = afJsonArray;

        switch (fsContainerJson.container_type) {
                case "normal":
                    afJsonContainer.type = "panel";
                    break;
                case "repeating":
                    afJsonContainer.type = "repeatingPanel";
                    break;
                case "tab":
                    afJsonContainer.type = "tabPanel";
                    break;
        }

        return afJsonContainer;
    };

    // DESCRIPTION
    var angularFormlyJsonForDescription = function(fsDescriptionJson) {
        var afJson = {};

        afJson.type = angularFormlyTypeStringForDescriptionFsTypeString(fsDescriptionJson['description_type']);
        afJson.templateOptions = templateOptionsForDescriptionFsJson(fsDescriptionJson);;

        return afJson;
    };

    // INTERACTIVE
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

        afJson.id = "value_"+fsInteractiveJson['element_id'];
        afJson.type = angularFormlyTypeStringForInteractiveFsTypeString(fsJsonTypeString);
        afJson.key = "value";

        fsInteractiveDetailsJson = fsInteractiveJson['interactive_details'];
        templateOptions = templateOptionsForInteractiveFsJson(fsInteractiveDetailsJson);
        afJson.templateOptions = templateOptions;

        if (fsInteractiveJson['validators'].length > 0) {
            fsValidatorsJsonArray = fsInteractiveJson['validators'];
            validatorsForFsJsonArray(fsValidatorsJsonArray, function(callbackValidators, callbackHideExpression, callbackExpressionProperties, callbackCrossKeys) {
                if (callbackValidators) {
                    afJson.validators = callbackValidators;   
                    // afJson.hideExpression = callbackHideExpression;
                    afJson.expressionProperties = callbackExpressionProperties;
                    if (afJson.data === undefined)
                    {
                	   afJson.data = {};
                    }
                    afJson.data.crossKeys = callbackCrossKeys;
                };
            });
            //add * if field is required
            for (var i in fsValidatorsJsonArray) {
                var oneValidator = fsValidatorsJsonArray[i];
                if (oneValidator['validator_type'] === 'notEmpty' && oneValidator['cross_key'] === undefined) {
                    afJson.data.isRequired = true;
                }
            }
        }

        //get mui stff
        var muiFields = muiFieldsForFsInteractiveJson(fsInteractiveJson);
        muiFields.validators = afJson.validators;
        muiFields.hideExpression = afJson.hideExpression;
        muiFields.expressionProperties = afJson.expressionProperties;

        //interactive JSON is being wrapped in a fieldgroup so that the saved data structure contains objects 
        var fieldGroupJson = {};
        fieldGroupJson.fieldGroup = [];
        fieldGroupJson.fieldGroup.push(afJson);
        fieldGroupJson.fieldGroup.push(muiFields);
        fieldGroupJson.key = fsInteractiveJson['mapping_key'];
		
        return fieldGroupJson;
    };
	
	// MUI
    var muiFieldsForFsInteractiveJson = function(fsInteractiveJson) {
        var muiFields = {};

        muiFields.id = "mui_"+fsInteractiveJson['element_id'];
        muiFields.type = "mui";
        muiFields.key = "mui";
        muiFields.defaultValue = "not_applicable";
        muiFields.templateOptions = {};

        muiFields.templateOptions.options = [];

        var missingOption = {}, 
            unobtainableOption = {}, 
            ignoreOption = {};

        missingOption.name = "M";
        missingOption.value = "missing";
        muiFields.templateOptions.options.push(missingOption);

        unobtainableOption.name = "U";
        unobtainableOption.value = "unobtainable";
        muiFields.templateOptions.options.push(unobtainableOption);

        ignoreOption.name = "I";
        ignoreOption.value = "ignore";
        muiFields.templateOptions.options.push(ignoreOption);
        
        return muiFields;
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
	
	// VALIDATORS
    var validatorsForFsJsonArray = function(fsValidatorsArray, callback) {
        var validators = {};
        var hideValidators = [];
        var disableValidators = [];
        var crossKeys = [];

        for (var validatorIndex in fsValidatorsArray) {
            fsValidator = fsValidatorsArray[validatorIndex];
            
            switch (fsValidator['validator_action']) {
                case "message":
                    var oneValidator = {};
                    oneValidator.message = '"'+fsValidator['message']+'"';
                    oneValidator.expression = expressionForFsValidators([fsValidator], false);
                    validators[fsValidator['element_id']] = oneValidator;
                    break;
                case "hide":
                    hideValidators.push(fsValidator);
                    break;
                case "disable":
                    disableValidators.push(fsValidator);
                    break;              
                default:
                    break;
            }

            crossKeys.push(fsValidator['cross_key']);
        }
        
        var expressionProperties = {};
        var hideExpression;
        expressionProperties.hide = expressionForFsValidators(hideValidators, true);
        expressionProperties['templateOptions.disabled'] = expressionForFsValidators(disableValidators, true);

        callback(validators, hideExpression, expressionProperties, crossKeys);
    };

    var expressionForFsValidators = function(fsValidatorsArray, triggerIfTrue) {
        var expression = function($viewValue, $viewModel, scope) {
            if (fsValidatorsArray.length < 1) {
                return false;
            }

            var result = false;

            for (var i in fsValidatorsArray) {
                var validator = fsValidatorsArray[i];

                var value;
                if (validator['cross_key'] === undefined || validator['cross_key'] === "") {
                    value = $viewValue || $viewModel;
                } else {
                    if (formScope.formular != undefined && formScope.formular[validator['cross_key']] != undefined) {
                        value = formScope.formular[validator['cross_key']].value;
                    } else {
                        value = "";
                    }
                }

                if (value != undefined) {
                    if (validator['validator_type'] === 'notEmpty') {
                        if (value != '' || value != false) {
                            result = true;
                        }
                    } else if (validator['validator_type'] === 'minDate' || validator['validator_type'] === 'maxDate') {
                        var dateDiff = moment(value).diff(moment(validator['expression']))
                    
                        if (dateDiff !== NaN) {
                            if (validator['validator_type'] === 'minDate') {
                                if (dateDiff >= 0) {
                                    result = true;
                                }
                            } else {
                                if (dateDiff <= 0) {
                                    result = true;
                                }
                            }
                        } 
                    } else {
                        var fsExpression;
                        if (validator['validator_type'] === 'minLength') {
                            fsExpression = "^.{"+validator['expression']+",}$";
                        } else if (validator['validator_type'] === 'maxLength') {
                            fsExpression = "^.{0,"+validator['expression']+"}$";
                        } else {
                            fsExpression = validator['expression'];
                        }
                        var regExp = new RegExp(fsExpression);
                        if (value) {
                            if (regExp.test(value)) {
                                result = true;
                            }
                        }
                    }
                } 
        	}

            if (triggerIfTrue) {
                result = !result;
            }

            return result;
        };

        return expression;
    };

    var templateOptionsForDescriptionFsJson = function(fsDescriptionJson) {
        var templateOptions = {};

        if (fsDescriptionJson['text']) {
            templateOptions.label = fsDescriptionJson['text'];
        }

        if (fsDescriptionJson['url']) {
            templateOptions.url = fsDescriptionJson['url'];
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

        //dropdown and radio
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

