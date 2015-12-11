formularGenerator.controller("rendererController",function ($scope, backendConnector, jsonTransformer) {

	var RE = $scope;

	RE.formular = {};
	RE.formularFields = [];

    backendConnector.getFormularSpecification(function(formularSpecification){
		
        var arrayWithJSONs = [];

        for (var objectNumber in formularSpecification['children']) {
            var currentJSONObject = formularSpecification['children'][objectNumber];
            // console.log("The current transform:");
            // console.log(currentJSONObject);
            var angularFormlyJSON = jsonTransformer.transformFormularSpecificationToAngularFormlyJSON(currentJSONObject);
            arrayWithJSONs.push(angularFormlyJSON);
        };

        // console.log("FormularSpecification filled in formularFields: ");
        // console.log(arrayWithJSONs);

        RE.formularFields = arrayWithJSONs[0];	
    });

	backendConnector.getFormularData(0,0,function(response){
		// console.log("FormularData filled in formular: ");
        // console.log(response);
    });    


    RE.onSubmit = onSubmit;
	function onSubmit() {
		//TODO postFormularData
    	console.log('form submitted:', RE.formular);
    }
});