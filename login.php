<!DOCTYPE html>
<html>
<head>
	<title>Authentication Nation</title>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
</head>
<body>
	<div id="form">
		<input type='email' placeholder='Email' id="email">
		<br/>
		<input type='password' placeholder='Password' id="password">
		<br/>
		<button id="normal">Login</button>
		<button id="facebook">Facebook Login</button>
	</div>
	<p>Login Successful</p>
		
	<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
	<script>
		$(document).ready(function(){
		    $('p').hide();

		    $('#normal').click(function(){
			
				var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");

				ref.authWithPassword({
				  email    : $('#email').val(),
				  password : $('#password').val()
				}, function(error, authData) {
				  if (error) {
				    console.log("Login Failed!", error);
				  } else {
				    console.log("Authenticated successfully with payload:", authData);
				    $('p').show();

				    var userRef = ref.child("users/"+authData.uid);
				    userRef.on("value", function(snapshot) {
					  // console.log(snapshot);
					  console.log(snapshot.val().name, "is logged in");
					  $('<span> as'+snapshot.val().name+'</span>').append('p');
					}, function (errorObject) {
					  console.log("The read failed: " + errorObject.code);
					});

				    localStorage.user_id = authData.uid;
				    localStorage.user_email = $('#email').val();
					window.location = "http://localhost/firebaseFirst/dashboard.php";

				  }
				});
			});

		    $('#facebook').click(function(){
			
				var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");


				ref.authWithOAuthPopup("facebook", function(error, authData) {
					if (error) {
						console.log("Login Failed!", error);
					} else {
						console.log("Authenticated successfully with payload:", authData);

						var user_id = authData.uid;
						var userRef = ref.child("users/"+user_id);

						var new_user = {name: authData.facebook.displayName, email: "id@facebook.com", provider: authData.provider};
						userRef.set(new_user);
						$('#form').hide();
						$('p').show();

						localStorage.user_id = user_id;
						localStorage.user_email = "id@facebook.com";
						// window.location = "http://localhost/firebaseFirst/dashboard.php";
					}
				},
				{
					remember: "sessionOnly",
					scope: "email"
				});
			});
		});
	</script>
</body>
</html>