<!DOCTYPE html>
<html>
<head>
	<title>Registration Nation</title>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>
</head>
<body ng-app="myApp">
	<div id="form" ng-controller="MainController">
		<input type='text' placeholder='Name' id="name" ng-model="name">
		<br/>
		<input type='email' placeholder='Email' id="email" ng-model="email">
		<br/>
		<input type='password' placeholder='Password' id="password" ng-model="password">
		<br/>
		<button ng-click="registerUser($event)">Submit</button>
	</div>
	<p>Registration Successful</p>
</body>
</html>