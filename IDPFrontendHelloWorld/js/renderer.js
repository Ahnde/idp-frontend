formularEditor.controller("renderer",function ($scope, backendConnector) {

	var RE = $scope;

	RE.user = {};
	RE.userFields = [];

    backendConnector.getFormularSpecification(function(formularSpecification){
		console.log("FormularSpecification filled in userFields: ");
    	console.log(formularSpecification);

    	var angularFormlyJSON = transformFormularSpecificationToAngularFormlyJSON(formularSpecification);
    	RE.userFields = formularSpecification;	
    });

    var transformFormularSpecificationToAngularFormlyJSON = function(formularSpecification) {
    	//TODO transform real formular specification to "angular-formly-json"
    	return formularSpecification;
    }


	backendConnector.getFormularData(0,0,function(response){
		console.log("FormularData filled in user: ");
    	console.log(response);
    });    


    RE.onSubmit = onSubmit;
	function onSubmit() {
		//TODO postFormularData
    	console.log('form submitted:', RE.user);
    }
});