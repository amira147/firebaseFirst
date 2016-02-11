<!DOCTYPE html>
<html>
<head>
	<title>Class List</title>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.1/moment.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>
</head>
<body ng-app="myApp">

<div ng-controller="MainController">
	<p>Logged in: <span class="user_email" ng-model="userEmail"></span></p>
	<button ng-click="logout($event)">Logout</button>

	<h4 ng-click="getClassListing()">Class list</h4>
	<ul id="example-messages" class="example-chat-messages">
	  <li ng-repeat="class in classes">
	    <strong class="example-chat-username" ng-click="displayClassDetails(class.$id)">{{ class.name }}</strong>
	    <p ng-click="deleteClass(class.$id)">{{ class.description }}</p>
	  </li>
	</ul>

	<div class="form">
		<input type='text' placeholder='Class Name' ng-model="classDetails.name">
		<br/>
		<input type='text' placeholder='Class Description' ng-model="classDetails.description">
		<br/>
		<input type='text' placeholder='Location' ng-model="classDetails.location.name">
		<br/>
		<button id="submit_class" ng-click="addClass()"">Submit</button>
	</div>

</div>

</body>
</html>