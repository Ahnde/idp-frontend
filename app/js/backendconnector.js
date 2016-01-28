formularGenerator.factory("backendConnector", ["$http", function ($http) {

	var BC = {};

	BC.getFormularSpecification = function (callback) {
		$http({
		 	method: 'GET',
		 	url: 'http://localhost:8080/IDPBackend/rest/form/4'
			// url: 'http://localhost:8000/response.json'
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

	BC.getFormularData = function (id,userid,callback) {
	$http({
		 	method: 'GET',
		 	url: 'http://localhost:8080/IDPBackend/rest/data/'+userid
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
		//TODO
		callback();
	}

	return BC;
}]);