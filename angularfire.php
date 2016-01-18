<!DOCTYPE html>
<html>
<head>
	<title>AngularFire</title>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>
	<script src="app.js"></script>

</head>
<body ng-app="myApp">
	<div ng-controller="MainController">
		<ul id="example-messages" class="example-chat-messages">
		  <li ng-repeat="user in users">
		    <strong class="example-chat-username">{{ user.name }}</strong>
		  </li>
		</ul>
	</div>


	<script type="text/javascript">
		// var myApp = angular.module("myApp", ["firebase"]);

		// myApp.factory('firebaseFactory', function($firebaseArray) {
		//     return {
		//         getUserList: function(){
		// 			var ref = new Firebase("https://radiant-heat-2965.firebaseio.com/users");
		// 			return $firebaseArray(ref);
		//         }
		//     };
		// });

		// myApp.controller("MainController", function($scope, firebaseFactory){
		// 	$scope.users = firebaseFactory.getUserList();
		// });

	</script>
</body>
</html>