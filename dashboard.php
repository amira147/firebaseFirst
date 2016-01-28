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

	<p>Logged in: <span class="user_email" ng-model="userEmail" ng-click="displayUserDetails()">{{ userEmail }}</span></p>
	<button ng-click="logout($event)">Logout</button>

	<ul>
		<li> Full name: {{userDetails.name}} </li>
		<li> Mobile: {{userDetails.mobile}} </li>
		<li> Date of birth: {{userDetails.date_of_birth}} </li>
	</ul>
	<hr/>

	<h1>Classes</h1>
	<ul class="example-chat-messages">
	  <li ng-repeat="class in classes">
	    <strong class="example-chat-username" ng-click="displayLessons(class.$id)">{{ class.name }}</strong>
	    <p ng-click="displayClassStudents(class.$id)">{{ class.description }}</p>
	    <h4>Lessons:</h4>
	    <ul class="example-chat-messages">
		  <li ng-repeat="lesson in lessons">
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
	    <strong class="example-chat-username">{{student.$id}} {{ student.name }}</strong>
	    <p ng-click="deleteStudent(student.$id)">{{ student.email }}</p>
	  </li>
	</ul>

	<hr/>

	<h1>Students for {{classId}} </h1>
	<ul class="example-chat-messages">
	  <li ng-repeat="student in classStudents">
	    <strong class="example-chat-username" ng-click="displayStudentDetails(student.$id)">{{student.$id}}</strong>
	    <!-- <p>{{ student.email }}</p> -->
	  </li>
	</ul>

	<hr/>

	<h1>Details for {{studentId}} </h1>
	<ul class="example-chat-messages">
	  <li> {{studentDetails.name}} </li>
	  <li> {{studentDetails.email}} </li>
	  <li> {{studentDetails.date_of_birth}} </li>
	</ul>


</div>
</body>
</html>