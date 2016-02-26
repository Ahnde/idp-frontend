formularGenerator.controller("rendererController",function ($scope, backendConnector, jsonTransformer) {

	var RE = $scope;

	RE.formular = {};
	RE.formularFields = [];

    backendConnector.getFormularSpecification(function(formularSpecification) {
		
        var arrayWithJSONs = [];

        arrayWithJSONs = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(formularSpecification);

        console.log("FormularSpecification filled in formularFields: ");
        console.log(arrayWithJSONs);
        console.log("");

        RE.formularFields = arrayWithJSONs;	

        backendConnector.getFormularData(1,1,function(response) {
            for(var key in response)
            {
                RE.formular[key] = response[key];
            }
        });
    });   


    RE.onSubmit = onSubmit;
	function onSubmit() {
		//TODO postFormularData
    	console.log('form submitted:', RE.formular);
    }
});