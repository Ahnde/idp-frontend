formularGenerator.factory("backendConnector", ["$http", function ($http) {
  	var backendURL = "localhost";
  	
	var BC = {};

	var printLogs = true;

	BC.getAllFormularSpecifications = function (callback) {
		$http({
		 	method: 'GET',
		 	url: 'http://'+backendURL+':8080/IDPBackend/rest/form/ids'
		}).then(function (response, status) {
			if (printLogs) {
				console.log("Formular-Specification list from backend successfully fechted: ");
				console.log(response.data);
				console.log("");
			}
			callback(response.data);
		},function (error){
			if (printLogs) {
				console.log("Error fetching Formular-Specification list in backendConnector: ");
				console.log(error);
				console.log("");
			}
			callback(error);
		});
	}

	BC.getFormularSpecification = function (formId, callback) {
		$http({
		 	method: 'GET',
		 	url: 'http://'+backendURL+':8080/IDPBackend/rest/form/' + formId
			// url: 'http://localhost:8000/response.json'
            // url: 'http://localhost:8000/TUM/Faecher/IDP/ipd/submodules/idp-frontend/documentation/Example_FormularSpecification.json'
		}).then(function (response, status) {
			if (printLogs) {
				console.log("Formular-Specification from backend successfully fechted: ");
				console.log(response.data);
				console.log("");
			}
			callback(response.data);
		},function (error){
			if (printLogs) {
				console.log("Error fetching Formular-Specification in backendConnector: ");
				console.log(error);
				console.log("");
			}
			callback(error);
		});
	}

	BC.getAllFormularDatas = function (formId, callback) {
		$http({
		 	method: 'GET',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/ids/' + formId
		}).then(function (response, status) {
			if (printLogs) {
				console.log("Formular-Data list from backend successfully fechted: ");
				console.log(response.data);
				console.log("");
			}
			callback(response.data);
		},function (error){
			if (printLogs) {
				console.log("Error fetching Formular-Data list in backendConnector: ");
				console.log(error);
				console.log("");
			}
			callback(error);
		});
	}

	BC.getFormularData = function (dataId, callback) {
		$http({
		 	method: 'GET',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/' + dataId
		}).then(function (response, status) {
			if (printLogs) {
				console.log("Formular-Data from backend successfully fechted: ");
				console.log(response.data);
				console.log("");
			}
			callback(response.data);
		},function (error){
			if (printLogs) {
				console.log("Error fetching Formular-Data in backendConnector: ");
				console.log(error);
				console.log("");
			}
			callback(error);
		});
	}

	BC.postFormularData = function (formularData, callback) {
		console.log("post formularData");
		console.log(formularData);
		$http({
		 	method: 'POST',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data',
    		data: formularData
		}).then(function (response, status) {
			if (printLogs) {
				console.log("Formular-Data saved successfully in backend");
				console.log(response.data);
				console.log("");
			}
			callback(true, null);
		},function (error){
			if (printLogs) {
				console.log("Error saving Formular-Data in backendConnector: ");
				console.log(error);
				console.log("");
			}
			callback(false, error);
		});
	}

	BC.updateFormularData = function (formularData, callback) {
		$http({
		 	method: 'PUT',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data',
            data: formularData
		}).then(function (response, status) {
			if (printLogs) {
				console.log("Formular-Data updated successfully in backend");
				console.log(response.data);
				console.log("");
			}
			callback(true, null);
		},function (error){
			if (printLogs) {
				console.log("Error updating Formular-Data in backendConnector: ");
				console.log(error);
				console.log("");
			}
			callback(false, error);
		});
	}

	return BC;
}]);
