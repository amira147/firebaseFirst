var myApp = angular.module("myApp", ["firebase"]);
var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");
var user_id = "";

myApp.factory('classFactory', function($firebaseArray){

		return {
	        getClassList: function(user_obj){
				var authData = ref.getAuth();
				if (authData) {
				  console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
				  var user_id = authData.uid;

				    if(authData.password){
					    user_obj.email = authData.password.email;
					}
					else if(authData.facebook){
					    user_obj.email = authData.facebook.email;
					}
					
					var classesRef = ref.child("users/"+user_id+"/classes");
					return $firebaseArray(classesRef);

				} else {
				  console.log("User is logged out");
				  // window.location = "http://localhost/firebaseFirst/login.php";
				}

	        },
	        addUserClass: function(user_obj, class_obj){
				var authData = ref.getAuth();
				if (authData) {
				  console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
				  var user_id = authData.uid;

				    if(authData.password){
					    user_obj.email = authData.password.email;
					}
					else if(authData.facebook){
					    user_obj.email = authData.facebook.email;
					}
		        	
		        	var classRef = ref.child("users/"+user_id+"/classes");

				    var new_class = {name: class_obj.name, description: class_obj.description};
				    classRef.push(new_class);
					
				} else {
				  console.log("User is logged out");
				  // window.location = "http://localhost/firebaseFirst/login.php";
				}
	        }

		};
});

myApp.factory('userFactory', function($firebaseArray) {
    
    return {
        getUserList: function(){
			var usersRef = ref.child("users");
			return $firebaseArray(usersRef);
        },
        registerUser: function(user_obj){

			ref.createUser({
			  email    : user_obj.email,
			  password : user_obj.password
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    var user_id = userData.uid;
				var userRef = ref.child("users/"+user_id);

			    var new_user = {name: user_obj.name, email: user_obj.email, provider: "password", classes: {}};
			    userRef.setWithPriority(new_user, 1);
				// $scope.users.$add({ name: user_obj.name, email: user_obj.email, provider: "password" });

			    // window.location = "http://localhost/firebaseFirst/login.php";
			  }
			});
        },
        loginUserNormal: function(user_obj){
        	console.log("password",user_obj.password);
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
        },
        loginUserFacebook: function(){
        	ref.authWithOAuthPopup("facebook", function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					console.log("Authenticated successfully with payload:", authData);

					var user_id = authData.uid;
					var userRef = ref.child("users/"+user_id);

					var new_user = {name: authData.facebook.displayName, email: authData.facebook.email, provider: authData.provider};
					userRef.setWithPriority(new_user, 1);

					localStorage.user_id = user_id;
					localStorage.user_email = authData.facebook.email;
					// window.location = "http://localhost/firebaseFirst/dashboard.php";
				}
			},
			{
				remember: "sessionOnly",
				scope: "email"
			});
        }
    };
});

myApp.controller("MainController", function($scope, userFactory, classFactory){
	$scope.users = userFactory.getUserList();
	$scope.email = "";
	$scope.name = "";
	$scope.password = "";

	$scope.classes = classFactory.getClassList({email: $scope.email});
	$scope.className = "";
	$scope.classDescription = "";

	$scope.registerUser = function(e){
		userFactory.registerUser({name: $scope.name, email:$scope.email, password:$scope.password});
	}

	$scope.loginUserNormal = function(e){
		userFactory.loginUserNormal({email:$scope.email, password:$scope.password});
	}
	
	$scope.loginUserFacebook = function(e){
		userFactory.loginUserFacebook();
	}

	$scope.addUserClass = function(e){
		classFactory.addUserClass({email: $scope.email}, {name: $scope.className, description:$scope.classDescription});
	}

	$scope.logout = function(e){
		ref.unauth();
	}
});