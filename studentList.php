<!DOCTYPE html>
<html>
<head>
	<title>Student Registration Nation</title>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.1/moment.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>
</head>
<body ng-app="myApp">
	<div id="form" ng-controller="MainController">
		
		<ul id="example-messages" class="example-chat-messages">
		  <li ng-repeat="student in students">
		    <strong class="example-chat-username">{{ student.name }}</strong>
		    <p>{{ student.email }}</p>
		  </li>
		</ul>

		<input type='text' placeholder='Name' id="name" ng-model="studentName">
		<br/>
		<input type='email' placeholder='Email' id="email" ng-model="studentEmail">
		<br/>
		<button ng-click="addStudent($event)">Submit</button>
	</div>
	<p>Registration Successful</p>
</body>
</html>