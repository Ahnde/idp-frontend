formularGenerator.controller("rendererController",
function ($route, $routeParams, $scope, backendConnector, jsonTransformer) {

    var RE = $scope;

    RE.formular = {};
    RE.formularFields = [];

    var formId, 
        userId,
        didLoadFormularData;

    $scope.isFormularActive = false;

    // dirty workaround to convert query params to a restful url
    $scope.$on('$routeChangeStart', function(event, next, current) {
        if ($routeParams.userId) {
            next.$$route.keys.push({ "name"    : "userId", "optional": false });
            next.$$route.originalPath = "/form/:id/user/:userId";
            next.$$route.regexp = new RegExp("^\/form\/(?:([^\/]+))\/user\/(?:([^\/]+))$");
            next.pathParams.userId = next.params.userId;
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

        if ($scope.selectedForm) {
            $scope.isFormularActive = true;
            
            $scope.dataList = getDataList();
            $scope.selectedData = getSelectedData();
        }
    });

    $scope.formChanged = function() {
        localStorage.setItem("selectedForm", JSON.stringify($scope.selectedForm));

        $routeParams.id = $scope.selectedForm['id'].toString();
        $route.updateParams($routeParams);
    }

    $scope.dataChanged = function() {
        localStorage.setItem("selectedData", JSON.stringify($scope.selectedData));

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
            localStorage.setItem("formList", JSON.stringify(response.formList));
        });   
    }

    var loadFormWithId = function(formId) {
        localStorage.setItem("selectedForm", "{ \"id\": "+formId+", \"label\": \""+formId+"\" }");

        backendConnector.getFormularSpecification(formId,function(formularSpecification) {
            var arrayWithJSONs = [];

            arrayWithJSONs = jsonTransformer.transformFormularSpecificationToAngularFormlyJson(formularSpecification);

            RE.formularFields = arrayWithJSONs;
        });
    }

    var loadDataList = function(formId) {
        backendConnector.getAllFormularDatas(formId,function(response) {
            localStorage.setItem("dataList", JSON.stringify(response.dataList));
        });
    }

    var loadDataWithId = function(userId) {
        localStorage.setItem("selectedData", "{ \"id\": "+userId+", \"label\": \""+userId+"\" }");

        backendConnector.getFormularData(userId,function(formularData) {
            for(var key in formularData)
            {
                RE.formular[key] = formularData[key];
            }
            didLoadFormularData = true;
        });
    }

    var getFormList = function() {
        return JSON.parse(localStorage.formList);
    }

    var getSelectedForm = function() {
        return JSON.parse(localStorage.selectedForm);
    }

    var getDataList = function() {
        return JSON.parse(localStorage.dataList);
    }

    var getSelectedData = function() {
        return JSON.parse(localStorage.selectedData);
    }
});