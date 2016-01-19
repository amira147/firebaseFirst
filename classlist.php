<!DOCTYPE html>
<html>
<head>
	<title>Class List</title>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>
</head>
<body ng-app="myApp">

<div ng-controller="MainController">
	<p>Logged in: <span class="user_email" ng-model="email"></span></p>
	<button ng-click="logout($event)">Logout</button>

	<ul id="example-messages" class="example-chat-messages">
	  <li ng-repeat="class in classes">
	    <strong class="example-chat-username">{{ class.name }}</strong>
	    <p>{{ class.description }}</p>
	  </li>
	</ul>

	<div class="form">
		<input type='text' placeholder='Class Name' id="class_name" ng-model="className">
		<br/>
		<input type='text' placeholder='Class Description' id="class_description" ng-model="classDescription">
		<br/>
		<button id="submit_class" ng-click="addUserClass($event)">Submit</button>
	</div>

</div>
<?php /*
<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
<script type="text/javascript">
	$(document).ready(function(){
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

		$('button').click(function(){
			ref.unauth();
			window.location = "http://localhost/firebaseFirst/login.php";
		});
	});
</script> */ ?>

</body>
</html>