<!DOCTYPE html>
<html>
<head>
	<title>Dashboard</title>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>
</head>
<body ng-app="myApp">

<div ng-controller="MainController">

	<p>Logged in: <span class="user_email" ng-model="userEmail">{{ userEmail }}</span></p>
	<button ng-click="logout($event)">Logout</button>

	<hr/>

	<h1>Classes</h1>
	<ul class="example-chat-messages">
	  <li ng-repeat="class in classes">
	    <strong class="example-chat-username">{{ class.name }}</strong>
	    <p>{{ class.description }}</p>
	    <h4>Lessons:</h4>
	    <ul class="example-chat-messages">
		  <li ng-repeat="lesson in class.lessons">
		    <strong class="example-chat-username">{{ lesson.name }}</strong>
		    <p>{{ lesson.description }}</p>
		  </li>
		</ul>
	  </li>
	</ul>

	<hr/>

	<h1>Students</h1>
	<ul class="example-chat-messages">
	  <li ng-repeat="student in students">
	    <strong class="example-chat-username">{{ student.name }}</strong>
	    <p>{{ student.email }}</p>
	  </li>
	</ul>


</div>
<?php /* 
<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
<script type="text/javascript">
	$(document).ready(function(){
		// $('#create_class').click(function(){
		// 	$('#form').hide();
		// });
		var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");
		var authData = ref.getAuth();
		if (authData) {
		  console.log("User " + authData.uid + " is logged in with " + authData.provider, authData);
		    if(authData.password){
			    $('.user_email').html(authData.password.email);
			}
			else if(authData.facebook){
			    $('.user_email').html(authData.facebook.email);
			}
		} else {
		  console.log("User is logged out");
		}

		$('#submit_class').click(function(){
			var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");

			    var user_id = localStorage.user_id;
				var classRef = ref.child("users/"+user_id+"/classes");

			    var new_class = {name: $('#class_name').val(), description: $('#class_description').val()};
			    classRef.push(new_class);
			    // $('#form').hide();
		});

		$('button').click(function(){
			ref.unauth();
			window.location = "http://localhost/firebaseFirst/login.php";
		});
	});
</script>
*/ ?>
</body>
</html>