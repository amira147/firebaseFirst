var myApp = angular.module("myApp", ["firebase"]);

myApp.factory('userFactory', function($firebaseArray) {
	var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");
    
    return {
        getUserList: function(){
			var usersRef = ref.child("users");
			return $firebaseArray(usersRef);
        },
        registerUser: function(user_obj){

			ref.createUser({
			  email    : user_obj.email,
			  password : user_obj.name
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    var user_id = userData.uid;
				var userRef = ref.child("users/"+user_id);

			    var new_user = {name: user_obj.name, email: user_obj.email, provider: "password"};
			    userRef.set(new_user);
				// $scope.users.$add({ name: user_obj.name, email: user_obj.email, provider: "password" });

			    // window.location = "http://localhost/firebaseFirst/login.php";
			  }
			});
        },
        loginUser: function(user_obj){
        	ref.authWithPassword({
			  email    : user_obj.email,
			  password : user_obj.password
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);

			    var userRef = ref.child("users/"+authData.uid);
			    userRef.on("value", function(snapshot) {
				  // console.log(snapshot);
				  console.log(snapshot.val().name, "is logged in");
				  $('<span> as'+snapshot.val().name+'</span>').append('p');
				}, function (errorObject) {
				  console.log("The read failed: " + errorObject.code);
				});

			    localStorage.user_id = authData.uid;
			    localStorage.user_email = user_obj.email;
				window.location = "http://localhost/firebaseFirst/dashboard.php";

			  }
			});
        }
    };
});

myApp.controller("MainController", function($scope, userFactory){
	$scope.users = userFactory.getUserList();
	$scope.email = "";
	$scope.name = "";
	$scope.password = "";

	$scope.registerUser = function(e){
		userFactory.registerUser({name: $scope.name, email:$scope.email});
	}

	$scope.loginUser = function(e){
		userFactory.loginUser({email:$scope.email, password:$scope.password});
	}
});