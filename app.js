var myApp = angular.module("myApp", ["firebase"]);
var firebase = new Firebase("https://omni-curo.firebaseio.com");

myApp.factory('firebaseFactory', function($firebaseArray, $firebaseObject, $q){
	var user_id;
	var factory = {
		User:{
			id: null
		}
	};
	var obj = {};

	//auth functions
    obj.setUser = function(aUser){
        user = aUser;
    }
    obj.isLoggedIn = function(){
    	var authData = firebase.getAuth();
		if (authData) {
		    console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
		    user_id = authData.uid;
		    factory.User.id = authData.uid;

		    obj.logActivity(authData.uid, "login");
		    
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
    	console.log("logout=> ", user_id);
    	if(user_id){
	    	firebase.unauth();
		    obj.logActivity(user_id, "logout").then(function(){
		    	console.log("logout activity logged");
		   //  	if(window.location != "http://localhost/firebaseFirst/login.php" && window.location != "http://localhost/firebaseFirst/registration.php"){
					// window.location = "http://localhost/firebaseFirst/login.php";
		   //  	}
		    });
    	}
    }

    //user functions
    obj.registerUser = function(user_obj){

		firebase.createUser({
		  email    : user_obj.email,
		  password : user_obj.password
		}, function(error, userData) {
		  if (error) {
		    console.log("Error creating user:", error);
		  } else {
		    console.log("Successfully created user account with uid:", userData.uid);
		    var user_id = userData.uid;
			var userRef = firebase.child("users/"+user_id);

		    var new_user = {
		    	name: user_obj.name, 
			    email: user_obj.email,
			    mobile: user_obj.mobile,
				date_of_birth: user_obj.dob,
			    provider: "password", 
				meta:{
					last_sync: Firebase.ServerValue.TIMESTAMP,
					update_date: Firebase.ServerValue.TIMESTAMP,
					create_date: Firebase.ServerValue.TIMESTAMP
				},
				image: user_obj.image,
				user_type:["10"],
			    status_id: "2",
			    students:""

			};
		    userRef.setWithPriority(new_user, 1);
		    obj.logActivity(userData.uid, "sign up");
		  }
		});
    }
    obj.loginUserNormal = function(user_obj){
    	
    	firebase.authWithPassword({
		  email    : user_obj.email,
		  password : user_obj.password
		}, function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    console.log("Authenticated successfully with payload:", authData);

		    var userRef = firebase.child("users/"+authData.uid);
		    userRef.on("value", function(snapshot) {
			  // console.log(snapshot);
			  console.log(snapshot.val().name, "is logged in");
			  $('<span> as'+snapshot.val().name+'</span>').append('p');
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

			window.location = "http://localhost/firebaseFirst/dashboard.php";

		  }
		});
    }
    obj.loginUserFacebook = function(){
    	firebase.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);

				var user_id = authData.uid;
				var userRef = firebase.child("users/"+user_id);

				var new_user = {
					name: authData.facebook.displayName, 
					email: authData.facebook.email, 
					provider: authData.provider,
					meta:{
						last_sync: Firebase.ServerValue.TIMESTAMP,
						create_date: Firebase.ServerValue.TIMESTAMP
					},
					image: authData.facebook.profileImageURL,
				    classes: {},
				    status_id: "2"

				};
				userRef.setWithPriority(new_user, 1);

				window.location = "http://localhost/firebaseFirst/dashboard.php";
			}
		},
		{
			remember: "sessionOnly",
			scope: "email"
		});
    }
    obj.getUserDetails = function(){
		
		var userRef = firebase.child("users/"+user_id);
		return $firebaseObject(userRef);
    }
    obj.editUser = function(user_obj){
        	
    	var userRef = firebase.child("users/"+user_id);

	    var edited_user = {
	    	name: user_obj.name,
		    email: user_obj.email,
			meta:{
				update_date: Firebase.ServerValue.TIMESTAMP
			},
			image: user_obj.image
		};
	    userRef.update(edited_user);
	}
	obj.logActivity = function(user_id, activity){
		console.log("function logActivity", " user_id=> ", user_id, " activity=> ", activity);

		var deferred = $q.defer();
		var activityRef = firebase.child("activity");

		activityRef.once('value', function(snapshot){
			if(!snapshot.hasChild(user_id)){
				activityRef.push(user_id);
			}

			var userActivityRef = firebase.child("activity/"+user_id);

			activity_obj = {};
			activity_obj[moment().unix()] = activity;
			userActivityRef.update(activity_obj, function(){
				deferred.resolve(true);
			});
		});
		
		return deferred.promise;
		
	}

    //student functions
    obj.getStudents = function(){

		var deferred = $q.defer();
		var students_array = [];
		var studentsRef = firebase.child("users/"+factory.User.id+"/students");
		var usersRef = firebase.child("users");
		
		// if(studentsRef.length > 0){
			studentsRef.on("value", function(snap){
				var count = 0; 
				var student_count = snap.numChildren();
				
				studentsRef.on("child_added", function(snap){
					
					usersRef.child(snap.key()).on("value", function(usersnap){
						var user_obj = usersnap.val();
						user_obj.$id = usersnap.key();

						students_array.push(user_obj);

						count++;
						if(count == student_count){
							deferred.resolve(students_array);
						}
					});
				
				});

			});
		// }
		
		return deferred.promise;
	}
    obj.addStudent = function(user_obj, student_obj){

			var studentRef = firebase.child("users/"+user_id+"/students");

		    var new_student = {
		    	name: student_obj.name, 
			    email: student_obj.email,
			    date_of_birth: student_obj.date_of_birth,
			    mobile: student_obj.mobile,
			    image: student_obj.image,
			    status_id: "2"
			};

		    studentRef.push(new_student, function(){
		    	obj.logActivity(user_id, "create student");
		    });
	}
    obj.editStudent = function(student_id, student_obj){
        	
    	var studentRef = firebase.child("users/"+student_id);

	    studentRef.update(student_obj);
	}
    obj.getStudentsByClass = function(class_id){

		var deferred = $q.defer();
		var students_array = [];
		var classStudentsRef = firebase.child("classes/"+class_id+"/students");

		$firebaseArray(classStudentsRef).$loaded().then(function(resp){
			if(resp.length){
				
				_.each(resp, function(student, index, list){
					var student_id = student.$id;
					var studentRef = firebase.child("users/"+student_id);
					
					students_array.push($firebaseObject(studentRef));

					if(index+1 == resp.length){
						deferred.resolve(students_array);
					}
				});
			} else {
				deferred.resolve([]);
			}	 
		}, function(error){
			deferred.reject(error);
		});	
		
		return deferred.promise;
	}
    obj.getStudentDetails = function(student_id){
			
		var studentRef = firebase.child("users/"+student_id);
		return $firebaseObject(studentRef);
	}
    obj.deleteStudent = function(student_id){
    	var studentRef = firebase.child("users/"+user_id+"/students/"+student_id);

		studentRef.update({status_id: "4"}, function(){
			classesRef = firebase.child("users/"+user_id+"/classes");

			classesRef.once("value", function(classes) {

			  classes.forEach(function(one_class) {
			  	var class_id = one_class.key();
			  	var classStudentRef = firebase.child("users/"+user_id+"/classes/"+class_id+"/students/"+student_id);
				if(classStudentRef){ 
					classStudentRef.remove();
				}
			  });

			});
		});
    }
    obj.hardDeleteStudent = function(student_id){
    	var studentRef = firebase.child("users/"+user_id+"/students/"+student_id);

		studentRef.remove(function(){

			//remove student from classes
			classesRef = firebase.child("users/"+user_id+"/classes");

			classesRef.once("value", function(classes) {

				classes.forEach(function(one_class) {
				  	var class_id = one_class.key();
				  	var classStudentRef = firebase.child("users/"+user_id+"/classes/"+class_id+"/students/"+student_id);
					if(classStudentRef){
						classStudentRef.remove();
					}

					lessonsRef = firebase.child("users/"+user_id+"/classes/"+class_id+"/lessons/");
					lessonsRef.once("value", function(lessons) {

						lessons.forEach(function(one_class) {
						  	var lesson_id = one_class.key();
						  	var lessonStudentRef = firebase.child("users/"+user_id+"/classes/"+class_id+"/lessons/"+lesson_id+"/attendance/"+student_id);
							if(lessonStudentRef){
								lessonStudentRef.remove();
							}
						});

					});
				});

			});

		});
    }
    
    //class functions
    obj.getClassListing = function(){
		var deferred = $q.defer();
		var classesRef = firebase.child("classes");
		var class_array = [];

		classesRef
		  .orderByChild('user_id')
		  .startAt(user_id).endAt(user_id)
		  .once('value', function(classes) {
		  	var count = 0;
		  	classes = classes.val();

		  	if(classes){
			  	var class_count = Object.keys(classes).length;

		  		_.each(classes, function(one_class, class_id, list){
					if (one_class.status_id == "2") {
						one_class.$id = class_id;
						class_array.push(one_class);
					}
					count++;
			  		if(count == class_count){
						deferred.resolve(class_array);
					}
		  		});
		  	}
		  	else{
		  		deferred.resolve([]);
		  	}
		  });
		
		return deferred.promise;
    }
    obj.addClass = function(class_obj){
        	
    	var classRef = firebase.child("classes");
    	class_obj.user_id = user_id;

	    classRef.push(class_obj, function(res){
	    	console.log("class write ", res);

		    obj.logActivity(user_id, "create class");
	    });
	}
    obj.editClass = function(class_id, class_obj){
        	
    	var classRef = firebase.child("classes/"+class_id);

	    classRef.update(class_obj);
	}
    obj.getClassDetails = function(class_id){
		var classRef = firebase.child("classes/"+class_id);

		return $firebaseObject(classRef);
    }
	obj.deleteClass = function(class_id){

		var classRef = firebase.child("classes/"+class_id);

		classRef.update({status_id: "4"});
	}
	obj.hardDeleteClass = function(class_id){

		var classRef = firebase.child("classes/"+class_id);

		classRef.remove();
	}
    
    //lesson functions
    obj.addLesson = function(class_id, lesson_obj){
        	
        	var lessonRef = firebase.child("lessons");

		    var new_lesson = {
		    	name: lesson_obj.name, 
			    description: lesson_obj.description,
			    duration:{
			    	start:"1455494400",
			    	end:"1455292800"
			    },
				venue:"Swimming Academy",
				attendance:"",
				class_id: class_id,
				user_id: user_id,
			    status_id: "2"
			};
		    lessonRef.push(new_lesson, function(){
		    	obj.logActivity(user_id, "create lesson");
		    });
    }
    obj.editLesson = function(lesson_id, lesson_obj){
        	console.log("editLesson ", lesson_obj);
    	var lessonRef = firebase.child("users/"+user_id+"/lessons/"+lesson_id);

	    var edited_lesson = {
	    	name: lesson_obj.name, 
		    description: lesson_obj.description,
			duration:{
				start: lesson_obj.duration.start,
				end: lesson_obj.duration.end
			},
			venue: lesson_obj.venue,
		    status_id: "2"
		};
	    lessonRef.update(edited_lesson);
	}
    obj.getLessonsByClassId = function(class_id){
    	var deferred = $q.defer();

		var lessons_array = [];
		var lessonsRef = firebase.child("lessons");

		lessonsRef
		  .orderByChild('class_id')
		  .startAt(class_id).endAt(class_id)
		  .once('value', function(lessons) {
		  		var count = 0;
			  	lessons = lessons.val();
			  	var lesson_count = Object.keys(lessons).length;

		  		_.each(lessons, function(one_lesson, lesson_id, list){
					if (one_lesson.status_id == "2") {
						one_lesson.$id = lesson_id;
						lessons_array.push(one_lesson);
					}
					count++;
			  		if(count == lesson_count){
						deferred.resolve(lessons_array);
					}
		  		});

		  });

		return deferred.promise;
	}
    obj.getLessonDetails = function(lesson_id){
		
		var lessonRef = firebase.child("lessons/"+lesson_id);
		
		return $firebaseObject(lessonRef);
    }
    obj.getLessonsByDate = function(timestamp){
    	var deferred = $q.defer();

    	var lessons_array = [];
    	var lessonsRef = firebase.child("lessons");

  		lessonsRef
		  	.orderByChild('user_id')
		  	.startAt(user_id).endAt(user_id)
  			.once("value", function(lessons) {
		  		var count = 0;
			  	lessons = lessons.val();
			  	var lesson_count = Object.keys(lessons).length;

  				_.each(lessons, function(lesson, index, list){
					var lesson_id = lesson.$id;
				  	var lesson_start_timestamp = lesson.duration.start;
				  	var lesson_start_date = moment(new Date(lesson_start_timestamp*1000)).format('MM/DD/YY');
				  	var lesson_end_timestamp = lesson.duration.end;

				  	var query_date = moment(new Date(timestamp*1000)).format('MM/DD/YY');
				  	if(lesson_start_date == query_date){
				  		console.log(query_date, " lesson=> ", lesson.name);
				  		lesson.$id = lesson_id;
				  		lessons_array.push(lesson);
				  	}
					count++;
			  		if(count == lesson_count){
						deferred.resolve(lessons_array);
					}
				});
			});

		return deferred.promise;
    }
	obj.deleteLesson = function(lesson_id){
		var lessonRef = firebase.child("lessons/"+lesson_id);

		lessonRef.update({status_id: "4"});
	}
	obj.hardDeleteLesson = function(lesson_id){

		var lessonRef = firebase.child("lessons/"+lesson_id);

		lessonRef.remove();
	}
	
	return obj;
	  
});


myApp.controller("MainController", function($scope, firebaseFactory){
	//User
	// $scope.users = firebaseFactory.getUsers();
	$scope.userEmail = firebaseFactory.isLoggedIn() || firebaseFactory.logout();
	$scope.userName = "";
	$scope.userPassword = "";
	$scope.userDetails = "";

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
			mobile: "0185555555",
			dob: "01/01/1990",
			image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB6VBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABoapWhAAAAonRSTlMAAQIDBAUGBwgJCg0PEBUWFxobHB4iIyUoKTAxNTY3ODk7PT5BQkNESUpLTE1PUFFSU1RVV1haXF1hYmNkZWdoaWtsbW92eHl6fH2AgYKEhYaIiouMjY6PkJGSlZeYmZqcoKGipKanqaqrr7Cxs7S5uru+v8DBxMjJysvNzs/Q1dbX2Nna29zd4OHj5OXm5+jp6uvs7e7v8PHy9PX2+Pr8/f73lciiAAACqElEQVQYGe3B51/NYRwG4Pt0TiojTvYImdkkK9l775FRlL3JDhVZiQgl5aj7L/Waj+c831Pnfl79rguIRCKRSCQSGaC82Tvqnrz/nkp9f/+4bsesIQgqseRmD//y88aiOELJ3fSB/9G6MYEgZrbQ4WUJ9HIO9NHp994YxPKuMq1LQyCVuEWP63EoVdPrDIRW02AlZJLdNPgxCioXaHIeIhP7adI3Hho1NDoDiYIfNOrKh8JCms2DwgmaHYNCPc3uQeEtzd5A4QPN2qDQRLNXULhPswdQuEyzK1A4RbNTUNhJs51QqKBZBRRKaVYKhUk0mwyF0TQbA4USms2EwlGanYTCM5q9gEIbzT5CoZlmL6FwjWY3oLCNZtuhMI1m06AQ76JRZxwSF2l0ERoLaDQfGjnNNGnOgchcmsyFTD0N6qGzlQZboVNMg6nQKfhNr76hEGqkVxOUaulVC6VKelVCaSy9xkKqiR6N0NpNj13QKkoxrVQRxGqYVjXURn5lGh2FkFvQT6f+eQjgEJ0OIIT8djq05yOIajqcRRib6bAFYaykwyqEUUaHcoSxjA7LEcYyOpQhjKV0KEMY5XRYgTDW0WE9wjhEhyMIIt5Mh5YEAsg5QaeaXKglljYwjaZVeRCKTT/5iR7fqmfFIRErqWqlyeezc+LItuLjrczA59MzYsiecXteM2PvDk5AVgyrfMgBerRhOAar+NxPDkLP+ekYhPw1DRy055UFGJjCvV+YFR37CpG5ZFUPs6a3KonMjDjSy6zqPTwcGajoYNZ1rI3BKHmHEneTMJnyiSLtU2AwqZsy3ZPhldtCoZZc+Cym1BL47KfUfvjUUaoWPncodRs+DZR6Cp83lHoFn3ZKtcGni1Kd8PlFqR749FEqBR9q9SMSiUQikUjkH38AJww99imnP3YAAAAASUVORK5CYII="
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

	$scope.displayUserDetails = function(){
		var user_obj = firebaseFactory.getUserDetails();
		
		user_obj.$loaded().then(function () {
			$scope.userDetails = user_obj;
		});
	}
	
	$scope.editUser = function(){
		
		firebaseFactory.editUser(
			{
				
		    	name: $scope.userDetails.name,
			    email: $scope.userDetails.email,
				meta:{
					update_date: Firebase.ServerValue.TIMESTAMP
				},
				image: $scope.userDetails.image
			});
	}

	//Students
	$scope.students = "";
	$scope.studentId = "";
	$scope.studentName = "";
	$scope.studentEmail = "";
	$scope.classStudents = "";
	$scope.studentDetails = "";

	firebaseFactory.getStudents().then(function(data){
		console.log(data);
		$scope.students = data;
	});

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
	
	$scope.editStudent = function(student_id){
		
		firebaseFactory.editClass(student_id,
			{
		    	name: $scope.studentDetails.name, 
			    email: $scope.studentDetails.email,
			    date_of_birth: $scope.studentDetails.date_of_birth,
			    mobile: $scope.studentDetails.mobile,
			    image: $scope.studentDetails.image,
			    parents: {},
			    status_id: "2"
			});
	}

	$scope.displayClassStudents = function(class_id){
		$scope.classId = class_id;
		
		firebaseFactory.getStudentsByClass(class_id).then(function (data) {
			$scope.classStudents = data;
		});
	}

	$scope.displayStudentDetails = function(student_id){
		$scope.studentId = student_id;
		var student_obj = firebaseFactory.getStudentDetails(student_id);
		// $scope.studentDetails = firebaseFactory.getStudentDetails(student_id);
		
		student_obj.$loaded().then(function () {
			$scope.studentDetails = student_obj;
		});
	}

	$scope.deleteStudent = function(student_id){
		firebaseFactory.deleteStudent(student_id);
	}

	$scope.hardDeleteStudent = function(student_id){
		firebaseFactory.hardDeleteStudent(student_id);
	}

	//Classes
	$scope.classes = "";
	$scope.classId = "";
	$scope.classDetails = "";

	
	var classRef = firebase.child("classes");
	classRef.on("value", function(){
		$scope.getClassListing();
	});

	$scope.getClassListing = function(){
		firebaseFactory.getClassListing().then(function(data){
			$scope.classes = data;
		});
	}
	$scope.displayClassDetails = function(class_id){
		$scope.classDetails = firebaseFactory.getClassDetails(class_id);
		// var class_obj = firebaseFactory.getClassDetails(class_id);
		
		// class_obj.then(function (data) {
		// 	$scope.classDetails = data;
		// 	console.log(123, data);
		// });
	}

	$scope.addClass = function(e){
		firebaseFactory.addClass(
			{
				name : $scope.classDetails.name,
				description : $scope.classDetails.description,
				// attendance_required : $scope.classDetails.attendance_required,
				// duration : {
				// 	end : $scope.classDetails.duration.end,
				// 	start : $scope.classDetails.duration.start,
				// 	lesson_count : $scope.classDetails.duration.lesson_count
				// },
				// enrollment_required : $scope.classDetails.enrollment_required,
				// listing_public : $scope.classDetails.listing_public,
				location:{
					name: $scope.classDetails.location.name
					// longitude: $scope.classDetails.location.longitude,
					// latitude: $scope.classDetails.location.latitude
				},
				// max_students : $scope.classDetails.max_students,
				// min_students : $scope.classDetails.min_students,
				// payment:{
				// 	billing : $scope.classDetails.payment.billing,
				// 	charge_method : $scope.classDetails.payment.charge_method,
				// 	chargeable : $scope.classDetails.payment.chargeable,
				// 	fee: $scope.classDetails.payment.fee
				// },
				students : "",
			    status_id: "2"
			});
	}
	
	$scope.editClass = function(class_id){
		
		firebaseFactory.editClass(class_id,
			{
				name : $scope.classDetails.name,
				description : $scope.classDetails.description,
				attendance_required : $scope.classDetails.attendance_required,
				duration : {
					end : $scope.classDetails.duration.end,
					start : $scope.classDetails.duration.start,
					lesson_count : $scope.classDetails.duration.lesson_count
				},
				enrollment_required : $scope.classDetails.enrollment_required,
				listing_public : $scope.classDetails.listing_public,
				location:{
					name: $scope.classDetails.location.name,
					longitude: $scope.classDetails.location.longitude,
					latitude: $scope.classDetails.location.latitude
				},
				max_students : $scope.classDetails.max_students,
				min_students : $scope.classDetails.min_students,
				payment:{
					billing : $scope.classDetails.payment.billing,
					charge_method : $scope.classDetails.payment.charge_method,
					chargeable : $scope.classDetails.payment.chargeable,
					fee: $scope.classDetails.payment.fee
				},
				students : ""
			});
	}

	$scope.deleteClass = function(class_id){
		firebaseFactory.deleteClass(class_id);
	}

	$scope.hardDeleteClass = function(class_id){
		firebaseFactory.hardDeleteClass(class_id);
	}

	//Lessons
	$scope.lessons = "";
	$scope.lessonName = "";
	$scope.lessonDescription = "";
	$scope.lessonDetails = "";

	$scope.addLesson = function(e){
		firebaseFactory.addLesson(
		$scope.classId,
		{
			name: $scope.lessonDetails.name, 
			description:$scope.lessonDetails.description
		});
		
		firebaseFactory.getLessonsByClassId($scope.classId).then(function(data){
			$scope.lessons = data;
		});
	}
	
	$scope.editLesson = function(lesson_id){
		
		firebaseFactory.editLesson(lesson_id,
			{
				name: $scope.lessonDetails.name, 
			    description: $scope.lessonDetails.description,
				duration:{
					start: $scope.lessonDetails.duration.start,
					end: $scope.lessonDetails.duration.end
				},
				venue: $scope.lessonDetails.venue,
			    status_id: "2"
			});
	}

	$scope.displayLessons = function(class_id){
		$scope.classId = class_id;
		firebaseFactory.getLessonsByClassId(class_id).then(function(data){
			$scope.lessons = data;
		});
	}

	$scope.displayLessonDetails = function(lesson_id){
		var lesson_obj = firebaseFactory.getLessonDetails(lesson_id);
		
		lesson_obj.$loaded().then(function () {
			$scope.lessonDetails = lesson_obj;
		});
	}
	$scope.getLessonsByDate = function(timestamp){
		firebaseFactory.getLessonsByDate(timestamp).then(function(data){
			$scope.lessons = data;
		});
	}

	$scope.deleteLesson = function(lesson_id){
		firebaseFactory.deleteLesson(lesson_id);
		firebaseFactory.getLessonsByClassId($scope.classId).then(function(data){
			$scope.lessons = data;
		});
	}

	$scope.hardDeleteLesson = function(class_id, lesson_id){
		firebaseFactory.hardDeleteLesson(class_id, lesson_id);
	}
});

