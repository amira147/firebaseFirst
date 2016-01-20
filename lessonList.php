<!DOCTYPE html>
<html>
<head>
	<title>Lesson List</title>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>
</head>
<body ng-app="myApp">

<div ng-controller="MainController">
	<p>Logged in: <span class="user_email" ng-model="userEmail"></span></p>
	<button ng-click="logout($event)">Logout</button>

	<ul id="example-messages" class="example-chat-messages">
	  <li ng-repeat="lesson in lessons">
	    <strong class="example-chat-username">{{ lesson.name }}</strong>
	    <p>{{ lesson.description }}</p>
	  </li>
	</ul>

	<div class="form">
		<input type='text' placeholder='Class Name' id="class_name" ng-model="lessonName">
		<br/>
		<input type='text' placeholder='Class Description' id="class_description" ng-model="lessonDescription">
		<br/>
		<button id="submit_class" ng-click="addLesson(classId)">Submit</button>
	</div>

</div>

</body>
</html>