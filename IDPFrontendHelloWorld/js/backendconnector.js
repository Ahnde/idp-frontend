formularGenerator.factory("backendConnector", ["$http", function ($http) {

	var BC = {};

	BC.getFormularSpecification = function (callback) {
		$http({
		 	method: 'GET',
			url: 'http://localhost:8000/response.json'
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
		//TODO
		callback();
	}

	BC.postFormularData = function (formularData,callback) {
		//TODO
		callback();
	}
	
	return BC;
}]);