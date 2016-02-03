var chatWindow = document.getElementById("chatWindow");
var message = document.getElementById("message");
var chatForm = document.getElementById("chatForm");
var submit = document.getElementById("submit");
var user_type = document.getElementById("user_type");

function renderMessage(imgURI,text) {
	var image = "<img style='width:25px' src='" + imgURI + "'>";
	var display = "<p>"+image+text + "</p>";
	$(chatWindow).append(display);
	$(message).val('');
	chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getImageURL() {
	if($(user_type).text()=="Mentor")
		return "/img/mentor.png";
	else
		return "/img/ninja.png";
}

submit.onclick = function() {
	var msg = $(message).val();
	if (msg.length > 0) {
		socket.emit('pm', {message: msg, name: getParameterByName('user'), url: getImageURL()});
		renderMessage(getImageURL(),msg);
	}
	return false;
}

$(chatForm).submit(submit.onclick);

socket.on('pm', function(data) {
	renderMessage(data.url, data.message);
});
<<<<<<< HEAD

socket.on('screenshot', function(data) {
	var img = "<img style='width:25px;' src='"+data.url+"'>";
	var screenshot = "<img class= 'fancybox' style='width:30%;' src='"+data.image+"'>";
	var input = "<p>"+img+"" + screenshot + "</p>";
	$(chatWindow).append(input);
	chatWindow.scrollTop = chatWindow.scrollHeight;
    add_ZoomIn();
});
=======
>>>>>>> origin/master
