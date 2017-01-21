//Whether measured times are in teleop or auto
var isTeleop = false;

//Whether each time warning has already been said
var said90 = false;
var said60 = false;
var said45 = false;
var said30 = false;
var said15 = false;
var said10 = false;
var said5 = false;
// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// Sets function to be called when any NetworkTables key/value changes
//onRobotConnection(true);
NetworkTables.addGlobalListener(onValueChanged, true);

function onRobotConnection(connected) {
	var connectBox = document.getElementById("robot-state-connected");
	var connectLabel = document.getElementById("connected-label");
	var disconnectBox = document.getElementById("robot-state-disconnected");
	var disconnectLabel = document.getElementById("disconnected-label");
	var unknownBox = document.getElementById("robot-state-unknown");
	var unknownLabel = document.getElementById("unknown-label");

	if (connected) {
		disconnectLabel.style.display = "none";
		unknownLabel.style.display = "none";
		connectLabel.style.display = "inline-flex";
	}
	else if (!connected) {
		disconnectLabel.style.display = "inline-flex";
		unknownLabel.style.display = "none";
		connectLabel.style.display = "none";
	}
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement chooses which UI element to update when a NetworkTables variable changes.
	switch (key) {
		case '/SmartDashboard/timeRemaining':
			// When this NetworkTables variable is true, the timer will start.
			// You shouldn't need to touch this code, but it's documented anyway in case you do.
			var s = Math.floor(value);

			// Make sure timer is reset to black when it starts
			ui.timer.style.color = '#FFFFFF';

			// Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
			var m = Math.floor(s / 60);
			// Create seconds number that will actually be displayed after minutes are subtracted
			var visualS = (s % 60);

			if(s == -1.0){
				m = 0;
				visualS = 0;
			}
			else if (s <= 30) {
				// Solid red timer when less than 30 seconds left.
				ui.timer.style.color = '#FF3030';
			}

			// Add leading zero if seconds is one digit long, for proper time formatting.
			visualS = visualS < 10 ? '0' + visualS : visualS;
			ui.timer.innerHTML = m + ':' + visualS;

			if(s == 90 && !said90 && isTeleop){
				var audio = new Audio('voice\\90seconds.mp3');
				audio.play();
				said90 = true;
			}
			else if(s == 60 && !said60 && isTeleop){
				var audio = new Audio('voice\\60seconds.mp3');
				audio.play();
				said60 = true;
			}
			else if(s == 45 && !said45 && isTeleop){
				var audio = new Audio('voice\\45seconds.mp3');
				audio.play();
				said45 = true;
			}
			else if(s == 30 && !said30 && isTeleop){
				var audio = new Audio('voice\\30seconds.mp3');
				audio.play();
				said30 = true;
			}
			else if(s == 15 && !said15 && isTeleop){
				var audio = new Audio('voice\\15seconds.mp3');
				audio.play();
				said15 = true;
			}
			else if(s == 10 && !said10 && isTeleop){
				var audio = new Audio('voice\\10seconds.mp3');
				audio.play();
				said10 = true;
			}
			else if(s == 5 && !said5 && isTeleop){
				var audio = new Audio('voice\\5seconds.mp3');
				audio.play();
				said5 = true;
			}
			else if(s == 5 && !isTeleop){
				isTeleop = true;
			}
			break;

		// TODO: JAVA WRITE TO NETWORKTABLES FOR THESE WARNINGS
		case '/SmartDashboard/warnings/none':
			if(value) document.getElementById("None").style.visibility="visible";
		case '/SmartDashboard/warnings/collision':
			if(value) document.getElementById("Collision").style.visibility="visible";
		case '/SmartDashboard/warnings/pneumatics':
			if(value) document.getElementById("Pneumatics").style.visibility="visible";
		case '/SmartDashboard/warnings/temperature':
			if(value) document.getElementById("Temperature").style.visibility="visible";

	}
}

// Automode and Warning tabs

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function submitCamera() {
	document.getElementById("cameraSelection").style.visibility="hidden";
	if (document.getElementById("8070").checked) {
		document.getElementById("camera1").style.visibility="visible";
		document.getElementById("camera2").style.visibility="hidden";
	} else if (document.getElementById("8080").checked) {
		document.getElementById("camera2").style.visibility="visible";
		document.getElementById("camera1").style.visibility="hidden";
	}
}

function climb(climbing) {
	if (climbing) {
		var elem = document.getElementById("climb");
	  var angle = 0;
	  var id = setInterval(frame, 5);
	  function frame() {
			angle++;;
			document.getElementById("climb").style.transform = 'rotate(' + angle + 'deg)';
	  }
	}
}

function pneumatics(move) {
	if (move) {
		var elem = document.getElementById("pneumatics");
		var yPos = 0;
	  var id = setInterval(frame, 5);
	  function frame() {
			if (yPos > -30) {
				yPos--;
				elem.style.transform = 'translateY(' + yPos + 'px)';
			}
	  }
	}
}

function addListeners() {
	document.getElementById("Nothing").addEventListener("change", autoDisable);
	document.getElementById("miniRobot").addEventListener("touchmove", getTouchPosition, false);
	document.getElementById("miniRobot").addEventListener("touchend", function() {
		var draggable = document.getElementById("miniRobot");
		draggable.style.backgroundColor = "red";
	}, false);
}

function autoDisable() {
	if(document.getElementById("Nothing").checked) {
		document.getElementById("Hopper").disabled=true; document.getElementById("Hopper").checked=false;
		document.getElementById("Dump").disabled=true; document.getElementById("Dump").checked=false;
		document.getElementById("Gear").disabled=true; document.getElementById("Gear").checked=false;
		document.getElementById("Baseline").disabled=true; document.getElementById("Baseline").checked=false;
	}
	else {
		document.getElementById("Hopper").disabled=false;
		document.getElementById("Dump").disabled=false;
		document.getElementById("Gear").disabled=false;
		document.getElementById("Baseline").disabled=false;
	}
}

function getTouchPosition(event) {
	var draggable = document.getElementById("miniRobot");
	draggable.style.backgroundColor = "green";
	var touch = event.targetTouches[0];
	var x = touch.pageX-25;
	var y = touch.pageY-25;
	var airship1 = document.getElementById("airship1");

	if (x >= 339 && x <= 643) { // Keep these conditionals separate so the robot can be dragged along the edge
			// Place element where the finger is
		draggable.style.left = x + 'px';
	}
	if (y >= 49 && y <= 672) {
		draggable.style.top = y + 'px';
	}

	if (x > 643) x = 643;
	if (x < 339) x = 339;
	if (y < 49)  y = 49;
	if (y > 672) y = 672;

	if (document.getElementById("redField").style.visibility=="visible") { // Matching the computer coordinates to the field coordinates
		y *= -1;
		x -= 339;
		y += 672;
	} else if (document.getElementById("blueField").style.visibility=="visible") {
		x *= -1;
		x += 643;
		y -= 49;
	}

	console.log(x);
	console.log(y);
	event.preventDefault();
}

function switchCam(e) { // Switch camera feeds on key press
	var blueCam = document.getElementById("camera1");
	var greenCam = document.getElementById("camera2");
	if (e.keyCode == 61) { // equals/plus button
		console.log("Equals detected");
		if (blueCam.style.visibility==="visible") {
			console.log("Blue visible");
			blueCam.style.visibility="hidden";
			greenCam.style.visibility="visible";
		} else if (greenCam.style.visibility==="visible") {
			console.log("Green visible");
			greenCam.style.visibility="hidden";
			blueCam.style.visibility="visible";
		}
	}
}

function autoSelect() {
	var submitted;
	if (document.getElementById("submitAuto").checked) {
		var nothing = document.getElementById("Nothing");
		var hopper = document.getElementById("Hopper");
		var dump = document.getElementById("Dump");
		var gear = document.getElementById("Gear");
		var baseline = document.getElementById("Baseline");

		if (nothing.checked || hopper.checked || dump.checked || gear.checked || baseline.checked) {
			submitted = true;
			var autoModes = "";
			if (hopper.checked) autoModes += "hopper";
			if (dump.checked) autoModes += "dump";
			if (gear.checked) autoModes += "gear";
			if (baseline.checked) autoModes += "baseline";
			console.log(autoModes);
			//NetworkTables.putValue("autoModes", autoModes); // Concatenates autoModes string so Java can uses contains() to get modes
		} else {
			document.getElementById("submitAuto").checked = false;
		}
	}
		else {
		submitted = false;
		document.getElementById("Auto").reset();
	}

}

function dashboardInit() { // Called after alliance is submitted
		addListeners();
}

function allianceSelect() {
	var blueField = document.getElementById("blueField");
	var robot = document.getElementById("miniRobot");

	document.getElementById("colorSelection").style.visibility="hidden";
	if(document.getElementById("blueAlliance1").checked || document.getElementById("blueAlliance2").checked || document.getElementById("blueAlliance3").checked) {
		blueField.style.visibility="visible";
		robot.style.visibility="visible";
	}

	if(document.getElementById("redAlliance1").checked || document.getElementById("redAlliance2").checked || document.getElementById("redAlliance3").checked) {
		redField.style.visibility="visible";
		robot.style.visibility="visible";
	}


	if(document.getElementById("blueAlliance1").checked) robot.style.left = "415px";
	else if(document.getElementById("blueAlliance2").checked)	robot.style.left = "492px";
	else if(document.getElementById("blueAlliance3").checked)	robot.style.left = "575px";

	else if(document.getElementById("redAlliance1").checked) robot.style.left = "415px";
	else if(document.getElementById("redAlliance2").checked)	robot.style.left = "492px";
	else if(document.getElementById("redAlliance3").checked)	robot.style.left = "575px";

	document.getElementById("defaultOpen").click();
	dashboardInit();
}
