<html>
	<head>
		<title>Firebase Trial</title>
		<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	</head>
	<body>
		<div class="example-chat l-demo-container">
		  <header>Firebase Chat Demo</header>

		  <div class='example-chat-toolbar'>
		    <label for="nameInput">Username:</label>
		    <input type='text' id='nameInput' placeholder='enter a username...'>
		  </div>

		  <ul id='example-messages' class="example-chat-messages"></ul>

		  <footer>
		    <input type='text' id='messageInput'  placeholder='Type a message...'>
		  </footer>
		</div>
		
		<script src='https://code.jquery.com/jquery-2.2.0.min.js'></script>
		<script>
			$(document).ready(function(){
				  // CREATE A REFERENCE TO FIREBASE
				  var messagesRef = new Firebase('https://radiant-heat-2965.firebaseio.com/');

				  // REGISTER DOM ELEMENTS
				  var messageField = $('#messageInput');
				  var nameField = $('#nameInput');
				  var messageList = $('#example-messages');

				  // LISTEN FOR KEYPRESS EVENT
				  messageField.keypress(function (e) {
				    if (e.keyCode == 13) {
				      //FIELD VALUES
				      var username = nameField.val();
				      var message = messageField.val();

				      //SAVE DATA TO FIREBASE AND EMPTY FIELD
				      messagesRef.push({name:username, text:message});
				      messageField.val('');
				    }
				  });

				  // Add a callback that is triggered for each chat message.
				  messagesRef.limitToLast(10).on('child_added', function (snapshot) {
				    //GET DATA
				    var data = snapshot.val();
				    var username = data.name || "anonymous";
				    var message = data.text;

				    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
				    var messageElement = $("<li>");
				    var nameElement = $("<strong class='example-chat-username'></strong>")
				    nameElement.text(username);
				    messageElement.text(message).prepend(nameElement);

				    //ADD MESSAGE
				    messageList.append(messageElement)

				    //SCROLL TO BOTTOM OF MESSAGE LIST
				    messageList[0].scrollTop = messageList[0].scrollHeight;
				  });
			});
		</script>
	</body>
</html>