formularGenerator.factory("backendConnector", ["$http", function ($http) {
  	var backendURL = "localhost";
  	
	var BC = {};

	BC.getFormularSpecification = function (id, callback) {
		$http({
		 	method: 'GET',
		 	url: 'http://'+backendURL+':8080/IDPBackend/rest/form/' + id
			// url: 'http://localhost:8000/response.json'
            // url: 'http://localhost:8000/TUM/Faecher/IDP/ipd/submodules/idp-frontend/documentation/Example_FormularSpecification.json'
		}).then(function (response, status) {
			console.log("Formular-Specification from backend successfully fechted: ");
			console.log(response.data);
			console.log("");
			callback(response.data);
		},function (error){
			console.log("Error fetching Formular-Specification in backendConnector: ");
			console.log(error);
			console.log("");
			callback(error);
		});
	}

	BC.getFormularData = function (userid,callback) {
		$http({
		 	method: 'GET',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/' + userid
		}).then(function (response, status) {
			console.log("Formular-Data from backend successfully fechted: ");
			console.log(response.data);
			console.log("");
			callback(response.data);
		},function (error){
			console.log("Error fetching Formular-Data in backendConnector: ");
			console.log(error);
			console.log("");
			callback(error);
		});
	}

	BC.postFormularData = function (formularData,callback) {
		$http({
		 	method: 'POST',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data',
            data: formularData
		}).then(function (response, status) {
			console.log("Formular-Data saved successfully in backend: ");
			console.log(response.data);
			console.log("");
			callback(true, null);
		},function (error){
			console.log("Error saving Formular-Data in backendConnector: ");
			console.log(error);
			console.log("");
			callback(false, error);
		});
	}

	BC.updateFormularData = function (userid,formularData,callback) {
		$http({
		 	method: 'PUT',
            url: 'http://'+backendURL+':8080/IDPBackend/rest/data/' + userid,
            data: formularData
		}).then(function (response, status) {
			console.log("Formular-Data updated successfully in backend: ");
			console.log(response.data);
			console.log("");
			callback(true, null);
		},function (error){
			console.log("Error updating Formular-Data in backendConnector: ");
			console.log(error);
			console.log("");
			callback(false, error);
		});
	}

	return BC;
}]);
