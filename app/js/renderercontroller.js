formularGenerator.controller("rendererController",
function ($route, $routeParams, $scope, backendConnector, jsonTransformer) {

    var formId,
        dataId,
        didLoadFormularData;

    var RE = $scope;

    RE.formular = {};
    RE.formularFields = [];

    $scope.isFormularActive = false;

    $scope.$on('$routeChangeSuccess', function() {
        //clear models
        didLoadFormularData = false;
        RE.formular = {};
        RE.formularFields = {};

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
            } else {
                setSelectedForm(formId);
            }
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
        $route.updateParams($routeParams);
    }

    //user triggered a formular-data change
    $scope.dataChanged = function() {
        setSelectedData($scope.selectedData.id);

        $routeParams.dataId = $scope.selectedData['id'].toString();

        if (!didLoadFormularData) {
            $route.current = queryToREST($route.current);
        }

        $route.updateParams($routeParams);
    }

    //user triggered a formular-data submit
    RE.onSubmit = onSubmit;
    function onSubmit() {
        if (didLoadFormularData) {
            backendConnector.updateFormularData(dataId,RE.formular,function(success, error) {
                if (success) { } else { }
            });
        } else {
            backendConnector.postFormularData(RE.formular,function(success, error) {
                if (success) { } else { }
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
        setSelectedForm(formId, formId);

        backendConnector.getFormularSpecification(formId,function(formularSpecification) {
            var arrayWithJSONs = [];

            arrayWithJSONs = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(formularSpecification);

            RE.formularFields = arrayWithJSONs;
        });
    }

    var loadDataList = function(formId) {
        backendConnector.getAllFormularDatas(formId,function(response) {
            $scope.dataList = response.dataList;
        });
    }

    var loadDataWithId = function(dataId) {
        setSelectedData(dataId, dataId);

        backendConnector.getFormularData(dataId,function(formularData) {
            for(var key in formularData)
            {
                RE.formular[key] = formularData[key];
            }
            didLoadFormularData = true;
        });
    }

    // setter

    var setSelectedForm = function(formId, formLabel) {
        $scope.selectedForm = { "id": formId, "label": formLabel };
    }

    var setSelectedData = function(dataId, dataLabel) {
        $scope.selectedData = { "id": dataId, "label": dataLabel };
    }

    // dirty workaround

    // convert query params to a restful url
    var queryToREST = function(current) {

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
});