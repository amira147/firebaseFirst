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
	  <li ng-repeat="class in classes">
	    <strong class="example-chat-username" ng-click="displayLessons(class.$id)">{{ class.name }}</strong>
	    <p>{{ class.description }}</p>
	  </li>
	</ul>

	<h4>Lessons for {{classId}}</h4>
	<ul id="example-messages" class="example-chat-messages">
	  <li ng-repeat="lesson in lessons">
	    <strong class="example-chat-username" ng-click="displayLessonDetails(classId, lesson.$id)">{{ lesson.name }}</strong>
	    <p>{{ lesson.description }}</p>
	  </li>
	</ul>

	<ul>
		<li><h4>Lesson Details for {{lessonDetails.name}}</h4></li>
		<li>Description : {{lessonDetails.description}}</li>
		<li>Venue : {{lessonDetails.venue}}</li>
		<li>Start : {{lessonDetails.start.date}}, {{lessonDetails.start.time}}</li>
		<li>End : {{lessonDetails.end.date}}, {{lessonDetails.end.time}}</li>
		<li>Attendance : {{lessonDetails.attendance}}</li>
	</ul>

	<div class="form">
		<input type='text' placeholder='Lesson Name' ng-model="lessonName">
		<br/>
		<input type='text' placeholder='Lesson Description' ng-model="lessonDescription">
		<br/>
		<button id="submit_class" ng-click="addLesson(classId)">Submit</button>
	</div>

</div>

</body>
</html>