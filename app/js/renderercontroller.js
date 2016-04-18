formularGenerator.controller("rendererController",
function ($route, $routeParams, $scope, backendConnector, jsonTransformer) {

    var formId,
        dataId,
        didLoadFormularData;

    var removeIsNewDataAfterRouteChange = false;
    var RE = $scope;

    RE.formular = {};
    RE.formularFields = [];

    $scope.isFormularActive = false;
    $scope.formularTitle = "";

    $scope.$on('$routeChangeSuccess', function() {
        //clear models
        RE.formular = {};
        didLoadFormularData = false;
        $scope.savingError = false;
        $scope.savingSuccess = false;
        if (!removeIsNewDataAfterRouteChange) {
            $scope.isNewFormData = false;
        }
        removeIsNewDataAfterRouteChange = false;

        //load form list if not yet done
        if ($scope.formList === undefined) {
            loadFormList();
        }

        var isNewFormular = false;

        // load specific formular and data-list, only if new formular is selected
        if ($routeParams.id) {
            isNewFormular = formId !== $routeParams.id;
            if (isNewFormular) {
                formId = $routeParams.id;

                loadFormWithId(formId);
                loadDataList(formId);
            }
            setSelectedForm(formId);
            $scope.isFormularActive = true;
        } else {
            $scope.selectedForm = {};
            $scope.isFormularActive = false;
        }

        // load data set, if new formular or if new data are selected
        if ($routeParams.dataId) {
            if (isNewFormular || dataId !== $routeParams.dataId) {
                dataId = $routeParams.dataId;
                loadDataWithId(dataId);
            }
        } else {
            $scope.selectedData = {};
        }
    });

    //user triggered a formular change
    $scope.formChanged = function() {
        setSelectedForm($scope.selectedForm.id);

        if($route.current.$$route === undefined) {
            $route.current = createRoute($route.current, $scope.selectedForm.id);
        }
        
        $routeParams.id = $scope.selectedForm['id'].toString();
        delete $routeParams.dataId;

        $route.current = removeDataFromUrl($route.current);

        $route.updateParams($routeParams);
    }

    //user triggered a formular-data change
    $scope.dataChanged = function() {
        setSelectedData($scope.selectedData.id);

        $routeParams.dataId = $scope.selectedData['id'].toString();

        if (!didLoadFormularData) {
            $route.current = addDataToUrl($route.current);
        }

        $route.updateParams($routeParams);
    }

    RE.newFormData = newFormData;
    function newFormData() {
        $scope.isNewFormData = true;

        if ($routeParams.dataId) {
            removeIsNewDataAfterRouteChange = true;
            $routeParams.dataId = undefined;
            $route.current = removeDataFromUrl($route.current);
            $route.updateParams($routeParams);
        }
    }

    //user triggered a formular-data submit
    RE.onSubmit = onSubmit;
    function onSubmit() {
        if (didLoadFormularData) {
            var dataSelectElement = document.getElementById('data-select');
            var label = dataSelectElement.options[dataSelectElement.selectedIndex].innerHTML;
            var data = jsonTransformer.createResponseForLabelAndData(label, RE.formular);

            backendConnector.updateFormularData(dataId,label,data,function(success, error) {
                if (success) { 
                    $scope.savingSuccess = true;
                    $scope.savingError = false;
                } else { 
                    $scope.savingSuccess = false;
                    $scope.savingError = true;
                }
            });
        } else {
            var label = $scope.newDataLabel;
            var data = jsonTransformer.createResponseForLabelAndData(label, RE.formular);

            backendConnector.postFormularData(formId,label,data,function(success, error) {
                if (success) {
                    $scope.isNewFormData = "";
                    $scope.newDataLabel = "";
                    $scope.savingSuccess = true;
                    $scope.savingError = false;
                } else {
                    $scope.savingSuccess = false;
                    $scope.savingError = true;
                }
            });
        }
    }

    //
    // HELPER
    //

    // Backend calls

    var loadFormList = function() {
        backendConnector.getAllFormularSpecifications(function(response) {
            $scope.formList = response.formList;
        });   
    }

    var loadFormWithId = function(formId) {
        RE.formularFields = [];
        backendConnector.getFormularSpecification(formId, function(formularSpecification) {
            var arrayWithJSONs = [];
            
            $scope.formularTitle = formularSpecification.label
            arrayWithJSONs = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(formularSpecification);

            RE.formularFields = arrayWithJSONs;
        });
    }

    var loadDataList = function(formId) {
        backendConnector.getAllFormularDatas(formId, function(response) {
            $scope.dataList = response.dataList;
        });
    }

    var loadDataWithId = function(dataId) {
        RE.formular = {};

        backendConnector.getFormularData(dataId, function(formularData) {
            var data = formularData.data;
            for(var key in data)
            {
                RE.formular[key] = data[key];
            }
            setSelectedData(dataId);
            didLoadFormularData = true;
        });
    }

    // setter

    var setSelectedForm = function(formId) {
        $scope.selectedForm = { "id": formId };
    }

    var setSelectedData = function(dataId) {
        $scope.selectedData = { "id": dataId };
    }

    // dirty ngroute workarounds :(

    // create current route
    var createRoute = function(current, formId) {
        current.$$route = {};
        current.$$route.caseInsensitivityMatch = false;
        current.$$route.controller = "rendererController";
        current.$$route.keys = [];
        current.$$route.keys.push({ "name": "id", "optional": false });
        current.$$route.originalPath = "/form/:id";
        current.$$route.regexp = new RegExp("^\/form\/(?:([^\/]+))$");
        current.$$route.reloadOnSearch = true;
        current.params.id = formId;
        current.pathParams.id = formId;
        return current;
    }

    // convert current route so that data will be requested RESTful
    var addDataToUrl = function(current) {
        var found = false;
        for(var i = 0; i < current.$$route.keys.length; i++) {
            if (current.$$route.keys[i].name == 'dataId') {
                found = true;
            break;
            }
        }

        if (!found) {
            current.$$route.keys.push({ "name": "dataId", "optional": false });
        }
        current.$$route.originalPath = "/form/:id/data/:dataId";
        current.$$route.regexp = new RegExp("^\/form\/(?:([^\/]+))\/data\/(?:([^\/]+))$");
        current.pathParams.dataId = current.params.dataId;
        return current;
    }

    // convert current route, so that no more data appear in it
    var removeDataFromUrl = function(current) {
        current.$$route.keys = current.$$route.keys.filter(function (element) {
                                    return element.name !== "dataId";
                                });
        current.$$route.originalPath = "/form/:id";
        current.$$route.regexp = new RegExp("^\/form\/(?:([^\/]+))$");
        delete current.pathParams.dataId; 
        delete current.params.dataId;
        return current;
    }

    
});