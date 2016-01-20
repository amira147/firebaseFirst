var myApp = angular.module("myApp", ["firebase"]);
var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");
var user_id = "";


myApp.factory('firebaseFactory', function($firebaseArray){
	var user_id;
	var obj = {};

	//auth functions
    obj.setUser = function(aUser){
        user = aUser;
    }
    obj.isLoggedIn = function(){
    	var authData = ref.getAuth();
		if (authData) {
		    console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
		    user_id = authData.uid;

		    if(authData.password){
			    return authData.password.email;
			}
			else if(authData.facebook){
			    return authData.facebook.email;
			}

		} else {
		  console.log("User is logged out");
		  return false;

		}
    }
    obj.logout = function(){
    	ref.unauth();
    	if(window.location != "http://localhost/firebaseFirst/login.php" && window.location != "http://localhost/firebaseFirst/registration.php"){
			window.location = "http://localhost/firebaseFirst/login.php";
    	}
    }

    //user functions
    obj.getUsers = function(){
		var usersRef = ref.child("users");
		return $firebaseArray(usersRef);
    }
    obj.registerUser = function(user_obj){

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

		    var new_user = {
		    	name: user_obj.name, 
			    email: user_obj.email, 
			    provider: "password", 
				meta:{
					last_sync:"01/01/2016",
					create_date:"01/01/2016"
				},
				image: user_obj.image,
			    classes: {}
			};
		    userRef.setWithPriority(new_user, 1);

		  }
		});
    }
    obj.loginUserNormal = function(user_obj){
    	
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
    }
    obj.loginUserFacebook = function(){
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
				window.location = "http://localhost/firebaseFirst/dashboard.php";
			}
		},
		{
			remember: "sessionOnly",
			scope: "email"
		});
    }

    //student functions
    obj.getStudents = function(user_obj){

		var studentsRef = ref.child("users/"+user_id+"/students");
		return $firebaseArray(studentsRef);

    }
    obj.addStudent = function(user_obj, student_obj){
		if (obj.isLoggedIn()) {

			var studentRef = ref.child("users/"+user_id+"/students");

		    var new_student = {
		    	name: student_obj.name, 
			    email: student_obj.email,
			};

		    studentRef.push(new_student);

		} else {
		  console.log("User is logged out");
		}

    }
    //class functions
    obj.getClasses = function(user_obj){
			
		var classesRef = ref.child("users/"+user_id+"/classes");
		return $firebaseArray(classesRef);

    }
    obj.addClass = function(user_obj, class_obj){
		if (obj.isLoggedIn()) {
        	
        	var classRef = ref.child("users/"+user_id+"/classes");

		    var new_class = {
		    	name: class_obj.name, 
			    description: class_obj.description
			};
		    classRef.push(new_class);
			
		} else {
		  console.log("User is logged out");
		}
    }
	
	return obj;
	  
});


myApp.controller("MainController", function($scope, firebaseFactory){
	
	$scope.users = firebaseFactory.getUsers();
	$scope.userEmail = firebaseFactory.isLoggedIn() || firebaseFactory.logout();
	$scope.userName = "";
	$scope.userPassword = "";

	$scope.loginUserNormal = function(e){
		firebaseFactory.loginUserNormal({
			email:$scope.userEmail, 
			password:$scope.userPassword
		});
	}

	$scope.registerUser = function(e){
		firebaseFactory.registerUser({
			name: $scope.userName, 
			email:$scope.userEmail, 
			password:$scope.userPassword,
			image:"http://www.clker.com/cliparts/C/j/Q/q/M/o/male-profile-silhouette-md.png"
		});
	}

	$scope.loginUserNormal = function(e){
		firebaseFactory.loginUserNormal({
			email:$scope.userEmail, 
			password:$scope.userPassword
		});
	}
	
	$scope.loginUserFacebook = function(e){
		firebaseFactory.loginUserFacebook();
	}

	$scope.logout = function(e){
		firebaseFactory.logout();
	}

	$scope.students = firebaseFactory.getStudents({email: $scope.userEmail});
	$scope.studentName = "";
	$scope.studentEmail = "";

	$scope.addStudent = function(e){
		firebaseFactory.addStudent(
			{email: $scope.userEmail}, 
			{
				name: $scope.studentName, 
				email:$scope.studentEmail,
				date_of_birth: "19/02/1996",
				mobile: "01855555555",
				image: "http://www.clker.com/cliparts/C/j/Q/q/M/o/male-profile-silhouette-md.png"
			});
	}

	$scope.classes = firebaseFactory.getClasses({email: $scope.userEmail});
	$scope.className = "";
	$scope.classDescription = "";

	$scope.addClass = function(e){
		firebaseFactory.addClass(
			{email: $scope.userEmail}, 
			{
				name: $scope.className, 
				description:$scope.classDescription
			});
	}
});