formularGenerator.controller("rendererController",
function ($route, $routeParams, $scope, backendConnector, jsonTransformer) {

    var RE = $scope;

    RE.formular = {};
    RE.formularFields = [];

    var formId, 
        userId,
        didLoadFormularData;

    $scope.isFormularActive = false;

    $scope.$on('$routeChangeStart', function(event, next, current) {
        if ($routeParams.userId && next.$$route) {
            next = queryToREST(next);
        }
    });

    $scope.$on('$routeChangeSuccess', function() {

        //clear models
        didLoadFormularData = false;
        RE.formular = {};
        RE.formularFields = {};

        //load form list if not yet done
        if (!localStorage.formListHasBeenLoaded) {
            loadFormList();
            localStorage.setItem("formListHasBeenLoaded", true);       
        }

        var isNewFormular = false;

        // load formular and data list, only if new formular is selected
        if ($routeParams.id) {
            isNewFormular = formId !== $routeParams.id;
            if (isNewFormular) {
                formId = $routeParams.id;
                loadFormWithId(formId);
                loadDataList(formId);
            } else {
                setSelectedForm(formId);
            }
        } else {
            localStorage.setItem("selectedForm", JSON.stringify({}));
        }

        // load data set, if new formular or if new data are selected
        if ($routeParams.userId) {
            if (isNewFormular || userId !== $routeParams.userId) {
                userId = $routeParams.userId;
                loadDataWithId(userId);
            }
        } else {
            localStorage.setItem("selectedData", JSON.stringify({}));
        }

        //bind formular and data to its scope variables
        $scope.formList = getFormList();
        $scope.selectedForm = getSelectedForm();
        $scope.isFormularActive = ($scope.selectedForm != undefined) && !(Object.keys($scope.selectedForm).length === 0 && JSON.stringify($scope.selectedForm) === JSON.stringify({}));

        if ($scope.isFormularActive) {
            $scope.dataList = getDataList();
            $scope.selectedData = getSelectedData();
        } 
    });

    $scope.formChanged = function() {
        setSelectedForm($scope.selectedForm.id);

        if($route.current.$$route === undefined) {
            $route.current = createRoute($route.current, $scope.selectedForm.id);
        }
        
        $routeParams.id = $scope.selectedForm['id'].toString();
        $route.updateParams($routeParams);
    }

    $scope.dataChanged = function() {
        setSelectedData($scope.selectedData.id);

        $routeParams.userId = $scope.selectedData['id'].toString();
        $route.updateParams($routeParams);
    }

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


    // HELPER

    var loadFormList = function() {
        backendConnector.getAllFormularSpecifications(function(response) {
            setFormList(response.formList);
        });   
    }

    var loadFormWithId = function(formId) {
        setSelectedForm(formId)

        backendConnector.getFormularSpecification(formId,function(formularSpecification) {
            var arrayWithJSONs = [];

            arrayWithJSONs = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(formularSpecification);

            RE.formularFields = arrayWithJSONs;
        });
    }

    var loadDataList = function(formId) {
        backendConnector.getAllFormularDatas(formId,function(response) {
            setDataList(response.dataList);
        });
    }

    var loadDataWithId = function(userId) {
        setSelectedData(userId);

        backendConnector.getFormularData(userId,function(formularData) {
            for(var key in formularData)
            {
                RE.formular[key] = formularData[key];
            }
            didLoadFormularData = true;
        });
    }

    var setFormList = function(formList) {
        localStorage.setItem("formList", JSON.stringify(formList));
    }

    var getFormList = function() {
        return JSON.parse(localStorage.formList);
    }

    var setSelectedForm = function(formId) {
        localStorage.setItem("selectedForm", "{ \"id\": "+formId+", \"label\": \""+formId+"\" }");
    }

    var getSelectedForm = function() {
        return JSON.parse(localStorage.selectedForm);
    }

    var setDataList = function(dataList) {
        localStorage.setItem("dataList", JSON.stringify(dataList));
    }

    var getDataList = function() {
        return JSON.parse(localStorage.dataList);
    }

    var setSelectedData = function(userId) {
        localStorage.setItem("selectedData", "{ \"id\": "+userId+", \"label\": \""+userId+"\" }");
    }

    var getSelectedData = function() {
        return JSON.parse(localStorage.selectedData);
    }

    // dirty workaround

    // convert query params to a restful url
    var queryToREST = function(next) {
        next.$$route.keys.push({ "name": "userId", "optional": false });
        next.$$route.originalPath = "/form/:id/user/:userId";
        next.$$route.regexp = new RegExp("^\/form\/(?:([^\/]+))\/user\/(?:([^\/]+))$");
        next.pathParams.userId = next.params.userId;
        return next;
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