<!DOCTYPE html>
<html>
<head>
	<title>Dashboard</title>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
</head>
<body>
<p>Logged in: <span class="user_email"></span></p>
<button>Logout</button>

<!-- <button id="create_class">Create Class</button> -->

<div class="form">
	<input type='text' placeholder='Class Name' id="class_name">
	<br/>
	<input type='text' placeholder='Class Description' id="class_description">
	<br/>
	<button id="submit_class">Submit</button>
</div>

<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
<script type="text/javascript">
	$(document).ready(function(){
		// $('#create_class').click(function(){
		// 	$('#form').hide();
		// });
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

		$('#submit_class').click(function(){
			var ref = new Firebase("https://radiant-heat-2965.firebaseio.com");

			    var user_id = localStorage.user_id;
				var classRef = ref.child("users/"+user_id+"/classes");

			    var new_class = {name: $('#class_name').val(), description: $('#class_description').val()};
			    classRef.push(new_class);
			    // $('#form').hide();
		});

		$('button').click(function(){
			ref.unauth();
			window.location = "http://localhost/firebaseFirst/login.php";
		});
	});
</script>
</body>
</html>