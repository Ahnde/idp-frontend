formularGenerator.factory("backendConnector", ["$http", function ($http) {
  	var backendURL = "localhost";
  	
	var BC = {};

	var printLogs = false;

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

	BC.getFormularSpecification = function (id, callback) {
		$http({
		 	method: 'GET',
		 	url: 'http://'+backendURL+':8080/IDPBackend/rest/form/' + id
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
		//TODO get data for specific form
		$http({
		 	method: 'GET',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/ids'
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

	BC.getFormularData = function (userid,callback) {
		$http({
		 	method: 'GET',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/' + userid
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

	BC.postFormularData = function (formularData,callback) {
		$http({
		 	method: 'POST',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data',
            data: formularData
		}).then(function (response, status) {
			console.log("Formular-Data saved successfully in backend");
			if (printLogs) {
				
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

	BC.updateFormularData = function (userid,formularData,callback) {
		$http({
		 	method: 'PUT',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/' + userid,
            data: formularData
		}).then(function (response, status) {
			console.log("Formular-Data updated successfully in backend");
			if (printLogs) {
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
