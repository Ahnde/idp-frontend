"use strict";

describe("true", function() {
	it("Should be true", function() {
		var myBool = true;
		dump(myBool);
		expect(true).toBeTruthy();
	});
});

describe("true", function() {
	it("Should be true", function() {
		expect(true).toBe(false);
	});
});

describe('something', function() {
	var $httpBackend, scope;

	beforeEach(inject(function ($injector, $rootScope, $controller) {

    	$httpBackend = $injector.get('$httpBackend');
    	jasmine.getJSONFixtures().fixturesPath='base/test/mock';

    	$httpBackend.whenGET('http://localhost:8080/IDPBackend/rest/form/2').respond(
        	getJSONFixture('mock_formularSpecification.json')
    	);

    	scope = $rootScope.$new();
    	$controller('something', {'$scope': scope});

	}));


	it('should have some resultsets', function() {
    	$httpBackend.flush();
    	expect(scope.result_sets.length).toBe(59);
	});

});


describe("json transformer factory", function () {
	var jsonTransformer;

  	beforeEach(module("jsonTransformer"));

  	beforeEach(inject(function (_jsonTransformer_) {
    	jsonTransformer = _jsonTransformer_;
  	}));

  	it("should do something", function () {
  		var afArray = jsonTransformer.angularFormlyArrayForOptions(stubFsOptionsArray);



    	redditService.getSubredditsSubmittedToBy("yoitsnate").then(function(subreddits) {
      		expect(subreddits).toEqual(["golang", "javascript"]);
    	});
    	httpBackend.flush();
  	});
});

// describe("reddit api service", function () {
// 	var redditService, httpBackend;

//   	beforeEach(module("reddit"));

//   	beforeEach(inject(function (_redditService_, $httpBackend) {
//     	redditService = _redditService_;
//     	httpBackend = $httpBackend;
//   	}));

//   	it("should do something", function () {
//     	httpBackend.whenGET("http://api.reddit.com/user/yoitsnate/submitted.json").respond({
//         	data: {
//           		children: [
//             	{
//               		data: {
//                 		subreddit: "golang"
//               		}
//             	},
//            		{
//            			data: {
//                 		subreddit: "javascript"
//             		}
//             	},
//             	{
//               		data: {
//                 		subreddit: "golang"
//               		}
//             	},
//             	{
//               		data: {
//                 		subreddit: "javascript"
//               		}
//             	}]
//         	}
//     	});

//     	redditService.getSubredditsSubmittedToBy("yoitsnate").then(function(subreddits) {
//       		expect(subreddits).toEqual(["golang", "javascript"]);
//     	});
//     	httpBackend.flush();
//   	});
// });