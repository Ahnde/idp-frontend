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
    }

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
		/*
		console.log('Angular Formly JSON')
		console.log(angularFormlyJsonArray)
		console.log('')
                 */
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
    }

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

        afJson.id = "value_"+fsInteractiveJson['element_id'];;
        afJson.type = angularFormlyTypeStringForInteractiveFsTypeString(fsJsonTypeString);
        afJson.key = "value";

        fsInteractiveDetailsJson = fsInteractiveJson['interactive_details'];
        templateOptions = templateOptionsForInteractiveFsJson(fsInteractiveDetailsJson);
        afJson.templateOptions = templateOptions;

        if (fsInteractiveJson['validators'].length > 0) {
            fsValidatorsJsonArray = fsInteractiveJson['validators'];
            validatorsForFsJsonArray(fsValidatorsJsonArray, function(callbackValidators, callbackHideExpression, callbackExpressionProperties, callbackCrossKeys) {
                afJson.validators = callbackValidators;   
                afJson.hideExpression = callbackHideExpression;
                afJson.expressionProperties = callbackExpressionProperties;
                if (afJson.data === undefined)
                {
                	afJson.data = {};
                }
                afJson.data.crossKeys = callbackCrossKeys;
            });
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
    }

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
        var hideExpression;
        var expressionProperties = {};
        var crossKeys = [];

        var oneValidator,
            afValidator,
            theValidator;
        for (var validatorIndex in fsValidatorsArray) {
            fsValidator = fsValidatorsArray[validatorIndex];
            crossKeys.push(fsValidator['cross_key']);
            validatorForFsJson(fsValidator, validators, hideExpression, expressionProperties, 
            					function(callbackValidators, callbackHideExpression, callbackExpressionProperties) {
                					validators = {};
                					templateOptions = {};
                					expressionProperties = {};
                					
                					validators = callbackValidators;
                					hideExpression = callbackHideExpression;
					                expressionProperties = callbackExpressionProperties;
					            }
			);
        }
		
        callback(validators, hideExpression, expressionProperties, crossKeys);
    };

    var validatorForFsJson = function(fsValidator, oldValidators, oldHideExpression, oldExpressionProperties, callback) {
    	var validators = oldValidators;
    	var hideExpression = oldHideExpression;
    	var expressionProperties = oldExpressionProperties;
    	
    	switch (fsValidator['validator_action']) {
    		case "message":
    		    messageValidatorForFSValidator(fsValidator, validators, function(newValidators) {
    		    	validators = newValidators;
    		    });
    		    break;
			case "hide":
    			hideValidatorForFSValidator(fsValidator, hideExpression, function(newHideExpression) {
    				hideExpression = newHideExpression;
    			});
			    break;
    		case "disable":
    		    disableValidatorForFSValidator(fsValidator, expressionProperties, function(newExpressionProperties) {
    		    	expressionProperties = newExpressionProperties;
    		    });
    		    break;    		    
    		default:
    			//just send the old objects back
    	}
        
        callback(validators, hideExpression, expressionProperties);
    }

	//hide
	var hideValidatorForFSValidator = function(fsValidator, oldHideExpression, callback) {
		var hideExpression = oldHideExpression;
		
		var afValidator = {};
		
		var crossKey = "";
		if (fsValidator['cross_key']) {
			crossKey = fsValidator['cross_key'];
		}
		
		var validatorExpression;
		
		switch (fsValidator['validator_type']) {
		    case "minDate":
		        validatorExpression = expressionForDateValidator(fsValidator['expression'], true, crossKey);
		        break;
		    case "maxDate":
		        validatorExpression = expressionForDateValidator(fsValidator['expression'], false, crossKey);
		        break;
		    case "isRequired":
		        validatorExpression = expressionForRegExValidator("isRequired", crossKey);
		        break;
		    case "minLength":
		        validatorExpression = expressionForRegExValidator("^.{"+fsValidator['expression']+",}$", crossKey);
		        break;
		    case "maxLength":
		        validatorExpression = expressionForRegExValidator("^.{0,"+fsValidator['expression']+"}$", crossKey);
		        break;
		    case "regex":
		        validatorExpression = expressionForRegExValidator(fsValidator['expression'], crossKey);
		        break;
		    default:
		        return;
		}
		
		hideExpression = validatorExpression;
		callback(hideExpression);
	}
	
	//disable
	var disableValidatorForFSValidator = function(fsValidator, oldExpressionProperties, callback) {
		var expressionProperties = oldExpressionProperties;
		
		var afValidator = {};
		
		var crossKey = "";
		if (fsValidator['cross_key']) {
			crossKey = fsValidator['cross_key'];
		}
		
		var validatorExpression;
		
		switch (fsValidator['validator_type']) {
		    case "minDate":
		        validatorExpression = expressionForDateValidator(fsValidator['expression'], true, crossKey);
		        break;
		    case "maxDate":
		        validatorExpression = expressionForDateValidator(fsValidator['expression'], false, crossKey);
		        break;
		    case "isRequired":
		        validatorExpression = expressionForRegExValidator("isRequired", crossKey);
		        break;
		    case "minLength":
		        validatorExpression = expressionForRegExValidator("^.{"+fsValidator['expression']+",}$", crossKey);
		        break;
		    case "maxLength":
		        validatorExpression = expressionForRegExValidator("^.{0,"+fsValidator['expression']+"}$", crossKey);
		        break;
		    case "regex":
		        validatorExpression = expressionForRegExValidator(fsValidator['expression'], crossKey);
		        break;
		    default:
		        return;
		}
		
		expressionProperties['templateOptions.disabled'] = validatorExpression;
		callback(expressionProperties);
	}
		
	//message
	var messageValidatorForFSValidator = function(fsValidator, oldValidators, callback) {
		var validators = oldValidators;
		
		var afValidator = {};
		
		var crossKey = "";
		if (fsValidator['cross_key']) {
			crossKey = fsValidator['cross_key'];
		}
		
		var validatorName,
		    validatorExpression,
		    validatorMessage;
		
		switch (fsValidator['validator_type']) {
		    case "minDate":
		        validatorName = "minDate";
		        validatorExpression = expressionForDateValidator(fsValidator['expression'], true, crossKey);
		        break;
		    case "maxDate":
		        validatorName = "maxDate";
		        validatorExpression = expressionForDateValidator(fsValidator['expression'], false, crossKey);
		        break;
		    case "isRequired":
		        validatorName = "isRequired";
		        validatorExpression = expressionForRegExValidator("isRequired", crossKey);
		        break;
		    case "minLength":
		        validatorName = "minLength";
		        validatorExpression = expressionForRegExValidator("^.{"+fsValidator['expression']+",}$", crossKey);
		        break;
		    case "maxLength":
		        validatorName = "maxLength";
		        validatorExpression = expressionForRegExValidator("^.{0,"+fsValidator['expression']+"}$", crossKey);
		        break;
		    case "regex":
		        validatorName = fsValidator['validator_name'];
		        validatorExpression = expressionForRegExValidator(fsValidator['expression'], crossKey);
		        break;
		    default:
		    	callback(validators);
		        return;
		}
		
		validatorMessage = fsValidator['message'];
		
		afValidator['validatorName'] = validatorName;
		afValidator['validatorExpression'] = validatorExpression;
		afValidator['validatorMessage'] = '"'+validatorMessage+'"';
		
		toValidator = {};
		toValidator.expression = afValidator['validatorExpression'];
		toValidator.message = afValidator['validatorMessage'];
		
		validators[afValidator['validatorName']] = toValidator;
		callback(validators);
	}

    var expressionForDateValidator = function(fsDate, inputShouldBeGreater, crossKey) {

        var expression = function($viewValue, $viewModel, scope) {
            if (crossKey === "") {
                value = $viewValue || $viewModel;
            } else {
                value = formScope.formular[crossKey].value;
            }
        
            if (value) {
                var dateDiff = moment(value).diff(moment(fsDate))
        
                if (dateDiff !== NaN) {
                    if (inputShouldBeGreater) {
                        return dateDiff >= 0;
                    } else {
                        return dateDiff <= 0;
                    }
                } else {
                    return false;
                }
            }
        };
		
        return expression;
    }

    var expressionForRegExValidator = function(fsValidatorExpression, crossKey) {

        var expression = function($viewValue, $viewModel, scope) {
            if (crossKey === "") {
                value = $viewValue || $viewModel;
            } else {
                value = formScope.formular[crossKey].value;
            }
        
            if (value === undefined) {
                return false;
            }
        
            if (fsValidatorExpression === 'isRequired') {
                if (value != '' || value === true) {
                    return true;
                }
            } else {
                var regExp = new RegExp(fsValidatorExpression);
                if (value) {
                    if (regExp.test(value)) {
                        return true;
                    }
                }
            }
        	
            return false;
        };

        return expression;
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

