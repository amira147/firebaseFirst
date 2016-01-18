<!DOCTYPE html>
<html>
<head>
	<title>Registration Nation</title>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script src="app.js"></script>
</head>
<body>
	<div id="form">
		<input type='text' placeholder='Name' id="name">
		<br/>
		<input type='email' placeholder='Email' id="email">
		<br/>
		<input type='password' placeholder='Password' id="password">
		<br/>
		<button>Submit</button>
	</div>
	<p>Registration Successful</p>
	
	<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
	<script>
		$(document).ready(function(){
		    $('p').hide();
			
			$('button').click(function(){
				
				var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");

				ref.createUser({
				  email    : $('#email').val(),
				  password : $('#password').val()
				}, function(error, userData) {
				  if (error) {
				    console.log("Error creating user:", error);
				  } else {
				    console.log("Successfully created user account with uid:", userData.uid);
				    var user_id = userData.uid;
					var userRef = ref.child("users/"+user_id);

				    var new_user = {name: $('#name').val(), email: $('#email').val(), provider: "password"};
				    userRef.set(new_user);
				    $('#form').hide();
				    $('p').show();

				    // window.location = "http://localhost/firebaseFirst/login.php";
				  }
				});
			});


		});
	</script>
</body>
</html>