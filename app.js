var myApp = angular.module("myApp", ["firebase"]);

myApp.factory('firebaseFactory', function($firebaseArray) {
    return {
        getUserList: function(){
			var ref = new Firebase("https://radiant-heat-2965.firebaseio.com/users");
			return $firebaseArray(ref);
        },
        addUser: function(user_id, user_obj){
        	var ref = new Firebase("https://radiant-heat-2965.firebaseio.com/users/"+user_id);
			var myArray = $firebaseArray(ref);
        }
    };
});

myApp.controller("MainController", function($scope, firebaseFactory){
	$scope.users = firebaseFactory.getUserList();

	$scope.users.$add({ name: name, email: email, provider: "password" });
});