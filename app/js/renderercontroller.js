formularGenerator.controller("rendererController",
function ($route, $routeParams, $scope, backendConnector, jsonTransformer) {

    var RE = $scope;

    RE.formular = {};
    RE.formularFields = [];

    var formId, 
        userId,
        didLoadFormularData;

    $scope.$on('$routeChangeSuccess', function() {
        console.log($routeParams)
        
        didLoadFormularData = false;

        formId = $routeParams.id
        userId = $routeParams.userid;

        console.log(userId);

        backendConnector.getFormularSpecification(formId,function(formularSpecification) {
        
            var arrayWithJSONs = [];

            arrayWithJSONs = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(formularSpecification);

            console.log("FormularSpecification filled in formularFields: ");
            console.log(arrayWithJSONs);
            console.log("");

            RE.formularFields = arrayWithJSONs;
            RE.formular = {};

            if (userId) {
                backendConnector.getFormularData(userId,function(response) {
                    for(var key in response)
                    {
                        RE.formular[key] = response[key];
                    }
                    didLoadFormularData = true;
                });
            }
        });   
    });

    RE.onSubmit = onSubmit;
    function onSubmit() {
        if (didLoadFormularData) {
            backendConnector.updateFormularData(userId,RE.formular,function(success, error) {
                if (success) { } else { }
            });
        } else {
            backendConnector.postFormularData(RE.formular,function(success, error) {
                if (success) { } else { }
            });
        }
    }
});