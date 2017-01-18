var ui = {
	timer: document.getElementById('timer'),
	robotState: document.getElementById('robot-state'),
};
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
NetworkTables.addGlobalListener(onValueChanged, true);

function onRobotConnection(connected) {
	var state = connected ? 'Robot connected!' : 'Robot disconnected.';
	console.log(state);
	ui.robotState.innerHTML = state;
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
		case '/SmartDashboard/yaw': // Gyro rotation
			ui.gyro.val = value;
			ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
			if (ui.gyro.visualVal < 0) { // Corrects for negative values
				ui.gyro.visualVal += 360;
			}
			ui.gyro.arm.style.transform = ('rotate(' + ui.gyro.visualVal + 'deg)');
			ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
			break;
			// The following case is an example, for a robot with an arm at the front.
			// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
		case '/SmartDashboard/arm/encoder':
			// 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
			if (value > 1140) {
				value = 1140;
			} else if (value < 0) {
				value = 0;
			}
			// Calculate visual rotation of arm
			var armAngle = value * 3 / 20 - 45;

			// Rotate the arm in diagram to match real arm
			ui.robotDiagram.arm.style.transform = 'rotate(' + armAngle + 'deg)';
			break;
			// This button is just an example of triggering an event on the robot by clicking a button.
		case '/SmartDashboard/exampleVariable':
			if (value) { // If function is active:
				// Add active class to button.
				ui.example.button.className = 'active';
				ui.example.readout.innerHTML = 'Value is true';
			} else { // Otherwise
				// Take it off
				ui.example.button.className = '';
				ui.example.readout.innerHTML = 'Value is false';
			}
			break;
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
		case '/SmartDashboard/options': // Load list of prewritten autonomous modes
			// Clear previous list
			while (ui.autoSelect.firstChild) {
				ui.autoSelect.removeChild(ui.autoSelect.firstChild);
			}
			// Make an option for each autonomous mode and put it in the selector
			for (i = 0; i < value.length; i++) {
				var option = document.createElement('option');
				option.innerHTML = value[i];
				ui.autoSelect.appendChild(option);
			}
			// Set value to the already-selected mode. If there is none, nothing will happen.
			ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
			break;
		case '/SmartDashboard/autonomous/selected':
			ui.autoSelect.value = value;
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
	// The following code manages tuning section of the interface.
	// This section displays a list of all NetworkTables variables (that start with /SmartDashboard/) and allows you to directly manipulate them.
	var propName = key.substring(16, key.length);
	// Check if value is new and doesn't have a spot on the list yet
	if (isNew && !document.getElementsByName(propName)[0]) {
		// Make sure name starts with /SmartDashboard/. Properties that don't are technical and don't need to be shown on the list.
		if (key.substring(0, 16) === '/SmartDashboard/') {
			// Make a new div for this value
			var div = document.createElement('div'); // Make div
			ui.tuning.list.appendChild(div); // Add the div to the page

			var p = document.createElement('p'); // Make a <p> to display the name of the property
			p.innerHTML = propName; // Make content of <p> have the name of the NetworkTables value
			div.appendChild(p); // Put <p> in div

			var input = document.createElement('input'); // Create input
			input.name = propName; // Make its name property be the name of the NetworkTables value
			input.value = value; // Set
			// The following statement figures out which data type the variable is.
			// If it's a boolean, it will make the input be a checkbox. If it's a number,
			// it will make it a number chooser with up and down arrows in the box. Otherwise, it will make it a textbox.
			if (value === true || value === false) { // Is it a boolean value?
				input.type = 'checkbox';
				input.checked = value; // value property doesn't work on checkboxes, we'll need to use the checked property instead
			} else if (!isNaN(value)) { // Is the value not not a number? Great!
				input.type = 'number';
			} else { // Just use a text if there's no better manipulation method
				input.type = 'text';
			}
			// Create listener for value of input being modified
			input.onchange = function() {
				switch (input.type) { // Figure out how to pass data based on data type
					case 'checkbox':
						// For booleans, send bool of whether or not checkbox is checked
						NetworkTables.setValue(key, input.checked);
						break;
					case 'number':
						// For number values, send value of input as an int.
						NetworkTables.setValue(key, parseInt(input.value));
						break;
					case 'text':
						// For normal text values, just send the value.
						NetworkTables.setValue(key, input.value);
						break;
				}
			};
			// Put the input into the div.
			div.appendChild(input);
		}
	} else { // If the value is not new
		// Find already-existing input for changing this variable
		var oldInput = document.getElementsByName(propName)[0];
		if (oldInput) { // If there is one (there should be, unless something is wrong)
			if (oldInput.type === 'checkbox') { // Figure out what data type it is and update it in the list
				oldInput.checked = value;
			} else {
				oldInput.value = value;
			}
		} else {
			console.log('Error: Non-new variable ' + key + ' not present in tuning list!');
		}
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

function submitAlliance() {
	document.getElementById("colorSelection").style.visibility="hidden";
	if (document.getElementById("blueAlliance").checked) {
		document.getElementById("blueField").style.visibility="visible";
		document.getElementById("miniRobot").style.visibility="visible";
		/*document.getElementById("hopper1Blue").style.visibility="visible";
		document.getElementById("hopper2Blue").style.visibility="visible";
		document.getElementById("hopper3Blue").style.visibility="visible";
		document.getElementById("hopper4Blue").style.visibility="visible";
		document.getElementById("hopper5Blue").style.visibility="visible";*/
	} else if (document.getElementById("redAlliance").checked) {
		document.getElementById("redField").style.visibility="visible";
		document.getElementById("miniRobot").style.visibility="visible";
	}
	document.getElementById("defaultOpen").click();
	dashboardInit();
}

function submitCamera() {
	document.getElementById("cameraSelection").style.visibility="hidden";
	if (document.getElementById("8070").checked) {
		document.getElementById("camera1").style.visibility="visible";
	} else if (document.getElementById("8080").checked) {
		document.getElementById("camera2").style.visibility="visible";
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

function processTouch() {
	if (document.getElementById("blueField").style.visibility === "visible") {
		document.getElementById("miniRobot").addEventListener("touchmove", getTouchPosition, false);
	} else {
		console.log("Red");
	}
}

function getTouchPosition(e) {
	/*e.preventDefault();
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	console.log("x: " +  x);
	console.log("y: " + y);*/
	var draggable = document.getElementById("miniRobot");
	var touch = event.targetTouches[0];

    // Place element where the finger is
    draggable.style.left = touch.pageX-25 + 'px';
    draggable.style.top = touch.pageY-25 + 'px';
		console.log(touch.pageX-25);
		console.log(touch.pageY-25);
    event.preventDefault();
}

function dashboardInit() {
	var id = setInterval(frame, 0.5);
  function frame() {
		processTouch();
  }
}
