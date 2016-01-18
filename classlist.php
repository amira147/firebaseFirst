<!DOCTYPE html>
<html>
<head>
	<title>Class List</title>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
</head>
<body>
<p>Logged in: <span class="user_email"></span></p>
<button>Logout</button>

<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
<script type="text/javascript">
	$(document).ready(function(){
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

		$('button').click(function(){
			ref.unauth();
			window.location = "http://localhost/firebaseFirst/login.php";
		});
	});
</script>
</body>
</html>