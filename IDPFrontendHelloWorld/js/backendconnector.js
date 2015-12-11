formularGenerator.factory("backendConnector", ["$http", function ($http) {

	var BC = {};

	BC.getFormularSpecification = function (callback) {
		$http({
		 	method: 'GET',
		 	url: 'http://localhost:8080/IDPBackend/rest/form/2'
			//url: 'http://localhost:8000/response.json'
			//url: 'http://localhost:8080'
		}).then(function (response, status) {
			console.log("Data from backend successfully fechted: ");
			console.log(response.data);
			console.log("");
			callback(response.data);
		},function (error){
			console.log("Error in backendConnector: ");
			console.log(error);
			console.log("");
			callback(error);
		});
	}

	BC.getFormularData = function (id,userid,callback) {
	$http({
		 	method: 'GET',
		 	url: 'http://localhost:8080/IDPBackend/rest/data/1'
			//url: 'http://localhost:8080'
		}).then(function (response, status) {
			console.log(response.data);
			console.log("");
			callback(response.data);
		},function (error){
			console.log("Error in backendConnector: ");
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