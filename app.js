var myApp = angular.module("myApp", ["firebase"]);
var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");
var user_id = "";


myApp.factory('auth', function(){
	var user;

	return{
	    setUser : function(aUser){
	        user = aUser;
	    },
	    isLoggedIn : function(){
	    	var authData = ref.getAuth();
			if (authData) {
			    console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
			    var user_id = authData.uid;

			    if(authData.password){
				    return authData.password.email;
				}
				else if(authData.facebook){
				    return authData.facebook.email;
				}

			} else {
			  console.log("User is logged out");
			  // window.location = "http://localhost/firebaseFirst/login.php";
			}
	    }
	  }
});

myApp.factory('userFactory', function($firebaseArray) {
    
    return {
        getUsers: function(){
			var usersRef = ref.child("users");
			return $firebaseArray(usersRef);
        },
        registerUser: function(user_obj){

			ref.createUser({
			  email    : user_obj.userEmail,
			  password : user_obj.userPassword
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    var user_id = userData.uid;
				var userRef = ref.child("users/"+user_id);

			    var new_user = {
			    	name: user_obj.userName, 
				    email: user_obj.userEmail, 
				    provider: "password", 
				    classes: {}
				};
			    userRef.setWithPriority(new_user, 1);

			    // window.location = "http://localhost/firebaseFirst/login.php";
			  }
			});
        },
        loginUserNormal: function(user_obj){
        	
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

			    // localStorage.user_id = authData.uid;
			    // localStorage.user_email = user_obj.userEmail;
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

					var new_user = {
						name: authData.facebook.displayName, 
						email: authData.facebook.email, 
						provider: authData.provider
					};
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

myApp.factory('studentFactory', function($firebaseArray) {
    
    return {
        getStudents: function(user_obj){
        	var authData = ref.getAuth();
			if (authData) {
			    console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
			    var user_id = authData.uid;

			    if(authData.password){
				    user_obj.userEmail = authData.password.email;
				}
				else if(authData.facebook){
				    user_obj.userEmail = authData.facebook.email;
				}

				var studentsRef = ref.child("users/"+user_id+"/students");
				return $firebaseArray(studentsRef);

			} else {
			  console.log("User is logged out");
			  // window.location = "http://localhost/firebaseFirst/login.php";
			}
        },
        addStudent: function(user_obj, student_obj){
        	var authData = ref.getAuth();
			if (authData) {
			    console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
			    var user_id = authData.uid;

			    if(authData.password){
				    user_obj.userEmail = authData.password.email;
				}
				else if(authData.facebook){
				    user_obj.userEmail = authData.facebook.email;
				}

				var studentRef = ref.child("users/"+user_id+"/students");

			    var new_student = {
			    	name: student_obj.name, 
				    email: student_obj.email
				};

			    studentRef.push(new_student);

			} else {
			  console.log("User is logged out");
			  // window.location = "http://localhost/firebaseFirst/login.php";
			}

        }
    };
});

myApp.factory('classFactory', function($firebaseArray){

	return {
        getClasses: function(user_obj){
			var authData = ref.getAuth();
			if (authData) {
			    console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
			    var user_id = authData.uid;

			    if(authData.password){
				    user_obj.userEmail = authData.password.email;
				}
				else if(authData.facebook){
				    user_obj.userEmail = authData.facebook.email;
				}
				
				var classesRef = ref.child("users/"+user_id+"/classes");
				return $firebaseArray(classesRef);

			} else {
			  console.log("User is logged out");
			  // window.location = "http://localhost/firebaseFirst/login.php";
			}

        },
        addClass: function(user_obj, class_obj){
			var authData = ref.getAuth();
			if (authData) {
			  console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
			  var user_id = authData.uid;

			    if(authData.password){
				    user_obj.userEmail = authData.password.email;
				}
				else if(authData.facebook){
				    user_obj.userEmail = authData.facebook.email;
				}
	        	
	        	var classRef = ref.child("users/"+user_id+"/classes");

			    var new_class = {
			    	name: class_obj.name, 
				    description: class_obj.description
				};
			    classRef.push(new_class);
				
			} else {
			  console.log("User is logged out");
			  // window.location = "http://localhost/firebaseFirst/login.php";
			}
        }
	};
});

myApp.controller("MainController", function($scope, auth, userFactory, studentFactory, classFactory){
	
	$scope.users = userFactory.getUsers();
	$scope.userEmail = auth.isLoggedIn();
	$scope.userName = "";
	$scope.userPassword = "";

	$scope.registerUser = function(e){
		userFactory.registerUser({
			name: $scope.userName, 
			email:$scope.userEmail, 
			password:$scope.userPassword
		});
	}

	$scope.loginUserNormal = function(e){
		userFactory.loginUserNormal({
			email:$scope.userEmail, 
			password:$scope.userPassword
		});
	}
	
	$scope.loginUserFacebook = function(e){
		userFactory.loginUserFacebook();
	}

	$scope.logout = function(e){
		ref.unauth();
		  // window.location = "http://localhost/firebaseFirst/login.php";
	}

	$scope.students = studentFactory.getStudents({email: $scope.userEmail});
	$scope.studentName = "";
	$scope.studentEmail = "";

	$scope.addStudent = function(e){
		studentFactory.addStudent(
			{email: $scope.userEmail}, 
			{
				name: $scope.studentName, 
				email:$scope.studentEmail
			});
	}

	$scope.classes = classFactory.getClasses({email: $scope.userEmail});
	$scope.className = "";
	$scope.classDescription = "";

	$scope.addClass = function(e){
		classFactory.addClass(
			{email: $scope.userEmail}, 
			{
				name: $scope.className, 
				description:$scope.classDescription
			});
	}
});