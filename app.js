var myApp = angular.module("myApp", ["firebase"]);
var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");

myApp.factory('firebaseFactory', function($firebaseArray, $firebaseObject, $q){
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
					last_sync: Firebase.ServerValue.TIMESTAMP,
					update_date: Firebase.ServerValue.TIMESTAMP,
					create_date: Firebase.ServerValue.TIMESTAMP
				},
				image: user_obj.image,
			    classes: {},
			    status_id: "2"

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
    obj.getUserDetails = function(){
		
		var userRef = ref.child("users/"+user_id);
		return $firebaseObject(userRef);
    }
    obj.editUser = function(user_obj){
        	
    	var userRef = ref.child("users/"+user_id);

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

    //student functions
    obj.getStudents = function(user_obj){

		var studentsRef = ref.child("users/"+user_id+"/students");
		studentsRef = studentsRef.orderByChild('status_id').equalTo("2");

		return $firebaseArray(studentsRef);
	}
    obj.addStudent = function(user_obj, student_obj){

			var studentRef = ref.child("users/"+user_id+"/students");

		    var new_student = {
		    	name: student_obj.name, 
			    email: student_obj.email,
			    date_of_birth: student_obj.date_of_birth,
			    mobile: student_obj.mobile,
			    image: student_obj.image,
			    parents: {},
			    status_id: "2"
			};

		    studentRef.push(new_student);
	}
    obj.editStudent = function(student_id, student_obj){
        	
    	var studentRef = ref.child("users/"+user_id+"/students/"+student_id);

	    var edited_student = {
	    	name: student_obj.name, 
		    email: student_obj.email,
		    date_of_birth: student_obj.date_of_birth,
		    mobile: student_obj.mobile,
		    image: student_obj.image,
		    parents: {},
		    status_id: "2"
		};
	    studentRef.update(edited_student);
	}
    obj.getStudentsByClass = function(class_id){
			
		var studentsRef = ref.child("users/"+user_id+"/classes/"+class_id+"/students");
		return $firebaseArray(studentsRef);
	}
    obj.getStudentDetails = function(student_id){
			
		var studentRef = ref.child("users/"+user_id+"/students/"+student_id);
		return $firebaseObject(studentRef);
	}
    obj.deleteStudent = function(student_id){
    	var studentRef = ref.child("users/"+user_id+"/students/"+student_id);

		studentRef.update({status_id: "4"}, function(){
			classesRef = ref.child("users/"+user_id+"/classes");

			classesRef.once("value", function(classes) {

			  classes.forEach(function(one_class) {
			  	var class_id = one_class.key();
			  	var classStudentRef = ref.child("users/"+user_id+"/classes/"+class_id+"/students/"+student_id);
				if(classStudentRef){ 
					classStudentRef.remove();
				}
			  });

			});
		});
    }
    obj.hardDeleteStudent = function(student_id){
    	var studentRef = ref.child("users/"+user_id+"/students/"+student_id);

		studentRef.remove(function(){

			//remove student from classes
			classesRef = ref.child("users/"+user_id+"/classes");

			classesRef.once("value", function(classes) {

				classes.forEach(function(one_class) {
				  	var class_id = one_class.key();
				  	var classStudentRef = ref.child("users/"+user_id+"/classes/"+class_id+"/students/"+student_id);
					if(classStudentRef){
						classStudentRef.remove();
					}

					lessonsRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons/");
					lessonsRef.once("value", function(lessons) {

						lessons.forEach(function(one_class) {
						  	var lesson_id = one_class.key();
						  	var lessonStudentRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons/"+lesson_id+"/attendance/"+student_id);
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
    obj.getClasses = function(user_obj){
			
		var classesRef = ref.child("users/"+user_id+"/classes");
		classesRef = classesRef.orderByChild('status_id').equalTo("2");

		return $firebaseArray(classesRef);
	}
    obj.addClass = function(class_obj){
        	
    	var classRef = ref.child("users/"+user_id+"/classes");

	    var new_class = {
	    	name: class_obj.name, 
		    description: class_obj.description,
			duration: class_obj.duration,
			chargeable: class_obj.chargeable,
			min_students: class_obj.min_students,
			max_students: class_obj.max_students,
			lesson_count: class_obj.lesson_count,
			extendable: class_obj.extendable,
			enrollment: class_obj.enrollment,
			attendance_required: class_obj.attendance_required,
			billing_cycle: class_obj.billing_cycle,
			listing_public: class_obj.listing_public,
			payment_type: class_obj.payment_type,
		    status_id: "2"
		};
	    classRef.push(new_class, function(res){
	    	console.log("class write ", res);
	    });
	}
    obj.editClass = function(class_id, class_obj){
        	
    	var classRef = ref.child("users/"+user_id+"/classes/"+class_id);

	    var edited_class = {
	    	name: class_obj.name, 
		    description: class_obj.description,
			duration: class_obj.duration,
			chargeable: class_obj.chargeable,
			min_students: class_obj.min_students,
			max_students: class_obj.max_students,
			lesson_count: class_obj.lesson_count,
			extendable: class_obj.extendable,
			enrollment: class_obj.enrollment,
			attendance_required: class_obj.attendance_required,
			billing_cycle: class_obj.billing_cycle,
			listing_public: class_obj.listing_public,
			payment_type: class_obj.payment_type,
		    status_id: "2"
		};
	    classRef.update(edited_class);
	}
    obj.getClassDetails = function(class_id){
		
		var classRef = ref.child("users/"+user_id+"/classes/"+class_id);
		return $firebaseObject(classRef);
    }
	obj.deleteClass = function(class_id){

		var classRef = ref.child("users/"+user_id+"/classes/"+class_id);

		classRef.update({status_id: "4"});
	}
	obj.hardDeleteClass = function(class_id){

		var classRef = ref.child("users/"+user_id+"/classes/"+class_id);

		classRef.remove();
	}
    
    //lesson functions
    obj.addLesson = function(class_id, lesson_obj){
        	
        	var lessonRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons");

		    var new_lesson = {
		    	name: lesson_obj.name, 
			    description: lesson_obj.description,
			    duration:{
			    	start:"1455289200",
			    	end:"1455292800"
			    },
				venue:"Swimming Academy",
				attendance:"",
			    status_id: "2"
			};
		    lessonRef.push(new_lesson);
    }
    obj.editLesson = function(class_id, lesson_id, lesson_obj){
        	
    	var lessonRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons/"+lesson_id);

	    var edited_lesson = {
	    	name: lesson_obj.name, 
		    description: lesson_obj.description,
			start:{
				date: lesson_obj.start_date,
				time: lesson_obj.start_time
			},
			end:{
				date: lesson_obj.end_date,
				time: lesson_obj.end_time
			},
			venue: lesson_obj.venue,
		    status_id: "2"
		};
	    lessonRef.update(edited_lesson);
	}
    obj.getLessonsByClassId = function(class_id){
			
		var lessonsRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons");
		lessonsRef = lessonsRef.orderByChild('status_id').equalTo("2");
		return $firebaseArray(lessonsRef);
	}
    obj.getLessonDetails = function(class_id, lesson_id){
		
		var lessonRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons/"+lesson_id);
		return $firebaseObject(lessonRef);
    }
    obj.getLessonsByDate = function(timestamp){
    	var deferred = $q.defer();

    	var lessons_array = [];
    	var classesRef = ref.child("users/"+user_id+"/classes");

		classesRef.once("value", function(classes) {

			classes.forEach(function(one_class) {
			  	var class_id = one_class.key();
			  	var class_start = one_class.val().duration.start;
			  	var class_end = one_class.val().duration.end;

			  	if(class_start <= timestamp && class_end >= timestamp){
			  		var lessonsRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons");

			  		lessonsRef.once("value", function(lessons) {

						lessons.forEach(function(lesson) {
							// console.log("lessons foreach");
						  	var lesson_id = lesson.key();
						  	var lesson_start_timestamp = lesson.val().duration.start;
						  	var lesson_start_date = moment(new Date(lesson_start_timestamp*1000)).format('MM/DD/YY');
						  	var lesson_end_timestamp = lesson.val().duration.end;

						  	var query_date = moment(new Date(timestamp*1000)).format('MM/DD/YY');
						  	
						  	// var dateLessonsRef = lessonsRef.orderByChild('duration.start').equalTo("2");

						  	if(lesson_start_date == query_date){
						  		console.log(query_date, " lesson=> ", lesson.val().name);
						  		lessons_array.push(lesson.val());
						  	}
						});

					});
			  	}
			});
			if(lessons_array.length > 0){
				deferred.resolve(lessons_array);
			}
			else{
				deferred.reject(error);
			}
		});
		// return $firebaseObject(lessonRef);

		return deferred.promise;
    }
	obj.deleteLesson = function(class_id, lesson_id){
		var lessonRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons/"+lesson_id);

		lessonRef.update({status_id: "4"});
	}
	obj.hardDeleteLesson = function(lesson_id){

		var lessonRef = ref.child("users/"+user_id+"/classes/"+class_id+"/lessons/"+lesson_id);

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
	$scope.students = firebaseFactory.getStudents();
	$scope.studentId = "";
	$scope.studentName = "";
	$scope.studentEmail = "";
	$scope.classStudents = "";
	$scope.studentDetails = "";

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
		var students_array = firebaseFactory.getStudentsByClass(class_id);
		
		students_array.$loaded().then(function () {
			$scope.classStudents = students_array;
		});
	}

	$scope.displayStudentDetails = function(student_id){
		$scope.studentId = student_id;
		var student_obj = firebaseFactory.getStudentDetails(student_id);
		
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
	$scope.classes = firebaseFactory.getClasses();
	$scope.classId = "";
	$scope.className = "";
	$scope.classDescription = "";
	$scope.classDetails = "";


	$scope.displayClassDetails = function(class_id){
		var class_obj = firebaseFactory.getClassDetails(class_id);
		
		class_obj.$loaded().then(function () {
			$scope.classDetails = class_obj;
		});
	}

	$scope.addClass = function(e){
		firebaseFactory.addClass(
			{
				name: $scope.className, 
				description:$scope.classDescription,
				duration: $scope.duration,
				chargeable: $scope.chargeable,
				min_students: $scope.min_students,
				max_students: $scope.max_students,
				lesson_count: $scope.lesson_count,
				extendable: $scope.extendable,
				enrollment: $scope.enrollment,
				attendance_required: $scope.attendance_required,
				billing_cycle: $scope.billing_cycle,
				listing_public: $scope.listing_public,
				payment_type: $scope.payment_type
			});
	}
	
	$scope.editClass = function(class_id){
		
		firebaseFactory.editClass(class_id,
			{
				name: $scope.classDetails.name, 
				description:$scope.classDetails.description,
				duration: $scope.classDetails.duration,
				chargeable: $scope.classDetails.chargeable,
				min_students: $scope.classDetails.min_students,
				max_students: $scope.classDetails.max_students,
				lesson_count: $scope.classDetails.lesson_count,
				extendable: $scope.classDetails.extendable,
				enrollment: $scope.classDetails.enrollment,
				attendance_required: $scope.classDetails.attendance_required,
				billing_cycle: $scope.classDetails.billing_cycle,
				listing_public: $scope.classDetails.listing_public,
				payment_type: $scope.classDetails.payment_type
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
	}
	
	$scope.editLesson = function(class_id, lesson_id){
		
		firebaseFactory.editLesson(class_id, lesson_id,
			{
				name: $scope.lessonDetails.name, 
			    description: $scope.lessonDetails.description,
				start:{
					date: $scope.lessonDetails.start_date,
					time: $scope.lessonDetails.start_time
				},
				end:{
					date: $scope.lessonDetails.end_date,
					time: $scope.lessonDetails.end_time
				},
				venue: $scope.lessonDetails.venue,
			    status_id: "2"
			});
	}

	$scope.displayLessons = function(class_id){
		$scope.classId = class_id;
		$scope.lessons = firebaseFactory.getLessonsByClassId(class_id);
		console.log("displayLessons ", $scope.lessons);
	}

	$scope.displayLessonDetails = function(class_id, lesson_id){
		var lesson_obj = firebaseFactory.getLessonDetails(class_id, lesson_id);
		
		lesson_obj.$loaded().then(function () {
			$scope.lessonDetails = lesson_obj;
		});
	}
	$scope.getLessonsByDate = function(timestamp){
		firebaseFactory.getLessonsByDate(timestamp).then(function(data){
			$scope.lessons = data;
		});

		// lessons_array.$loaded().then(function () {
		// 	$scope.lessons = lessons_array;
		// 	console.log("getLessonsByDate ", lessons_array);
		// });
	}

	$scope.deleteLesson = function(class_id, lesson_id){
		firebaseFactory.deleteLesson(class_id, lesson_id);
	}

	$scope.hardDeleteLesson = function(class_id, lesson_id){
		firebaseFactory.hardDeleteLesson(class_id, lesson_id);
	}
});

