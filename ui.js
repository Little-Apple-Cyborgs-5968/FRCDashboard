// cd FRCDashboard
// python -3 -m pynetworktables2js --robot roboRIO-5968-FRC.local
// cd C:\Program Files (x86)\Google\Chrome\Application
// chrome.exe --app=localhost:8888

var dash = {
 x : -1,
 y : -1,
 autoModes : 0,
 currentX : -1,
 currentY : -1
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



function onRobotConnection(connected) {
  console.log(connected);
	if (connected) {
	 $("#unknown-label").hide();
	 $("#disconnected-label").hide();
	 $("#connected-label").css("display", "inline-flex");
	}
	else if (!connected) {
	 $("#disconnected-label").css("display", "inline-flex");
	 $("#unknown-label").hide();
	 $("#connected-label").hide();
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
			$("#timer").css('color', '#FFFFFF');

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
				$("#timer").css('color', '#FF3030');
			}

			// Add leading zero if seconds is one digit long, for proper time formatting.
			visualS = visualS < 10 ? '0' + visualS : visualS;
			$("#timer").html(m + ':' + visualS);
			var audio;

			if(s == 90 && !said90 && isTeleop){
				audio = new Audio('voice\\90seconds.mp3');
				audio.play();
				said90 = true;
			}
			else if(s == 60 && !said60 && isTeleop){
				audio = new Audio('voice\\60seconds.mp3');
				audio.play();
				said60 = true;
			}
			else if(s == 45 && !said45 && isTeleop){
				audio = new Audio('voice\\45seconds.mp3');
				audio.play();
				said45 = true;
			}
			else if(s == 30 && !said30 && isTeleop){
				audio = new Audio('voice\\30seconds.mp3');
				audio.play();
				said30 = true;
			}
			else if(s == 15 && !said15 && isTeleop){
				audio = new Audio('voice\\15seconds.mp3');
				audio.play();
				said15 = true;
			}
			else if(s == 10 && !said10 && isTeleop){
				audio = new Audio('voice\\10seconds.mp3');
				audio.play();
				said10 = true;
			}
			else if(s == 5 && !said5 && isTeleop){
				audio = new Audio('voice\\5seconds.mp3');
				audio.play();
				said5 = true;
			}
			else if(s == 5 && !isTeleop){
				isTeleop = true;
				checkTeleop(isTeleop);
			}
			break;

		case '/SmartDashboard/warnings/none':
			 if(value) $("#None").css("visibility", "visible");
			 break;
		case '/SmartDashboard/warnings/collision':
			 if(value) $("#Collision").css("visibility", "visible");
			 break;
		case '/SmartDashboard/warnings/pneumatics':
			 if(value) $("#Pneumatics").css("visibility", "visible");
			 break;
		case '/SmartDashboard/warnings/temperature':
			 if(value) $("#Temperature").css("visibility", "visible");
			 break;

		case '/SmartDashboard/climbingRope':
			 if (value == -1) changeClimb("yellow");
       else if (value == 0) changeClimb("red");
			 else if (value == 1) changeClimb("green");
			 break;
		case '/SmartDashboard/climbHeight':
			 updateClimbHeight(value);
       if (value != 0) {
         startTimer();
       }

			 break;

		case '/SmartDashboard/currentX':
			dash.currentX = value;
			robotChange(currentX, dash.currentY);
			break;
		case '/SmartDashboard/currentY':
			dash.currentY = value;
			robotChange(dash.currentX, currentY);
			break;
    case '/SmartDashboard/pneumatics':
      if (value) pneumatics("green");
      else if(!value) pneumatics("red");
      break;

    case '/SmartDashboard/pressure':
      $("#pressureLabel").text(value);
      break;
	 }
}

function startTimer() {
  console.log("Timer started");
  var interval = 0;
  var remaining = 17;
  for (var i = 17; i > 0; i--) {
    interval+=1000;
    setTimeout(function () {
      remaining--;
  	 $("#climbTimer").text(remaining);
     console.log(remaining);
   }, interval);
 }
}

function robotChange(x, y) {
  var left = 344;
  var right = 648;
  var up = 50;
  var down = 685;

  var x = 200;
  var y = 50;

  console.log("robotChange");

  if ($("#redFieldSmall").css("visibility")==="visible") {
    y *= -1;
 	  x += left;
 	  y += down;

  } else if ($("#blueFieldSmall").css("visibility")==="visible") {
    x *= -1;
 	  x += right;
 	  y += up;
 }


  updateRobotPosition("y", y);
  updateRobotPosition("x", x);
}

// Automode and Warning tabs

function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = $(".tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
			tabcontent.eq(i).css("display", "none");
	}
	tablinks = $(".tablinks");
	for (i = 0; i < tablinks.length; i++) {
			tablinks.eq(i).removeClass("active");
	}
	$(tabName).css("display", "block");
 $(evt.currentTarget).addClass("active");
}

function updateClimbHeight(inches) {
 //$("#climbMeter").slider('value', inches);
 $("#climbNumber").html(inches);
}

function updatePressure(pressure) {
 $("#pressureMeter").slider('value', pressure);
 $("#pressureNumber").html(pressure);
}

function changeClimb(color) {
  if (color === "green") {
    $("#climb").css({ fill: "#64ce74" });
  } else if (color === "yellow") {
    $("#climb").css({ fill: "#ffe066" });
  } else if (color === "red") {
    $("#climb").css({ fill: "#ff3333" });
  }
}

function climb() {
  var angle = 0;
  var id1;
  id1 = setInterval(frame, 5);
  function frame() {
     angle++;
     $("#climb").css('transform', 'rotate(' + angle + 'deg)');
  }
}

function pneumatics(color) {
  if (color === "green") {
    console.log("Pneumatics turning green");
    $("#pneumatics").css({ fill: "#64ce74" });
  } else if (color === "red") {
    console.log("Pneumatics turning red");
    $("#pneumatics").css({ fill: "#ff3333" });
  }
}

function addListeners() {
  $("#miniRobot").on("touchmove", getTouchPosition);
  $("#miniRobot").on("touchend", function() {
	 $("#miniRobot").css("background-color", "red");
	 dash.x = -1;
	 dash.y = -1;
	 // Write x and y to NetworkTables to show touchend
 });
}

function pixelsToInches(height, base) {
	//console.log("Height: " + height);
	//console.log("Width: " + base);

	// Height of field image is 620 px
	// Width of field image is 282 px

	// Height of real field is 652 in
	// Width of real field is 324 in

	// Height ratio: 1.051612903 in per px
	// Width ratio: 1.14893617 in per px
	if (height != -1 && base != -1) {
	 var inchesHeight = height * 1.026771654;
	 var inchesWidth = base * 1.065789474;
	 console.log(inchesHeight + " inches height");
	 console.log(inchesWidth + " inches width");
	} else {
	 console.log("-1");
	}

	//NetworkTables.putValue("/SmartDashbard/fieldX", inchesWidth);
	//NetworkTables.putValue("/SmartDashboard/fieldY", inchesHeight);
	}

	function checkTeleop() {
  	if (isTeleop) {
  	 $("#auto-label").hide();
  	 $("#teleop-label").css("display", "inline-flex");
  	 console.log("isTeleop");
  	} else if (!isTeleop) {
  	 $("#teleop-label").hide();
  	 $("#auto-label").css("display", "inline-flex");
  	 console.log("NOT isTeleop");
  	}
	}

	function getTouchPosition(event) {
	var left = 344;
	var right = 648;
	var up = 50;
	var down = 685;

	$("#miniRobot").css('background-color', 'green');
	var touch = event.targetTouches[0];
	var x = touch.pageX-25;
	var y = touch.pageY-25;

	if (x >= left && x <= right) { // Keep these conditionals separate so the robot can be dragged along the edge
		 // Place element where the finger is
	 $("#miniRobot").css("left", x + 'px');
	}
	if (y >= up && y <= down) {
	 $("#miniRobot").css("top", y + 'px');
	}

	if (x > right) x = right;
	if (x < left) x = left;
	if (y < up)  y = up;
	if (y > down) y = down;

	if ($("#redFieldSmall").css("visibility")==="visible") { // Matching the computer coordinates to the field coordinates
	 y *= -1;
	 x -= left;
	 y += down;
	} else if ($("#blueFieldSmall").css("visibility")==="visible") {
	 x *= -1;
	 x += right;
	 y -= up;
	}

	if ($("#miniRobot").css("backgroundColor") === "red") {
	 console.log("red");
	 x = -1;
	 y = -1;
	}
	console.log("x pixels: " + x);
	console.log("y pixels: " + y);

	dash.x = x;
	dash.y = y;
	pixelsToInches(dash.y, dash.x);
	event.preventDefault();
}

// Update robot position on computer
function updateRobotPosition(dimension, pixel) {
  if (dimension === "x") {
    $("#miniRobot").css("left", pixel + 'px');
  } else if (dimension === "y") {
    $("#miniRobot").css("top", pixel + 'px');
  }
}

function keyPress(e) {
 if(e.keyCode == 99) {
   console.log("Climbing now");
   changeClimb("green");
 } else if(e.keyCode == 115) {
   console.log("Climbing stop");
   changeClimb("red");
 } else if(e.keyCode == 98) {
   console.log("Climbing backwards");
   changeClimb("yellow");
 } else if(e.keyCode == 117) {
   console.log("Pneumatics up");
   pneumatics("green");
 } else if(e.keyCode == 100) {
   console.log("Pneumatics down");
   pneumatics("red");
 }
}

function dashboardInit() { // Called after alliance is submitted
	 addListeners();
}

function animate(element_ID, animation) {
	 $(element_ID).css("visibility", "visible");
	 $(element_ID).addClass("animated");
	 $(element_ID).addClass(animation);
}

function allianceSelect() {
	animate("#robo", "fadeOut");
	animate("#logoBegin", "fadeOut");

	animate("#selectAlliance", "fadeOutLeft");
	animate("#redAlliance1-label", "fadeOutLeft");
	animate("#redAlliance3-label", "fadeOutLeft");
	animate("#blueAlliance2-label", "fadeOutLeft");

	animate("#hr", "fadeOutRight");
	animate("#redAlliance2-label", "fadeOutRight");
	animate("#blueAlliance1-label", "fadeOutRight");
	animate("#blueAlliance3-label", "fadeOutRight");
	animate("#submitAlliance-label", "fadeOutRight");



	animate("#timer", "fadeInLeft");

	setTimeout(function () {
	 animate("#state", "fadeInLeft");
	}, 500);
	setTimeout(function () {
	 animate("#tabs", "fadeInLeft");
	 animate("#auto1", "fadeInUp");
	 animate("#Warnings", "fadeInUp");
	 animate("#Auto", "fadeInUp");
	 $("#defaultOpen").css('pointer-events', 'auto');
	 $("#nextOpen").css('pointer-events', 'auto');
	 $("#defaultOpen").click();
	 $("#defaultOpen").addClass("active");
	}, 1000);
	setTimeout(function () {
	 animate("#mode", "fadeInLeft");
	 checkTeleop();
 	}, 1500);
	setTimeout(function () {
	 animate("#robot-diagram", "fadeInLeft");
   animate("#pressureLabel", "fadeInLeft");
   animate("#psi", "fadeInLeft");
   pneumatics("red");
   climb();
   changeClimb("red");
	}, 2000);
	setTimeout(function () {
	 animate("#climbMeter", "fadeInRight");
	 animate("#climbNumber", "fadeInRight");
	 animate("#climbLabel", "fadeInRight");
	}, 2500);
  setTimeout(function () {
	 animate("#climbTimer", "fadeInRight");
   animate("#climbTimerLabel", "fadeInRight");
  }, 3000);

	animate("#miniRobot", "zoomIn");

	if($("#blueAlliance1").is(':checked') || $("#blueAlliance2").is(':checked') || $("#blueAlliance3").is(':checked')) {
	 $("#blueFieldSmall").css("visibility", "visible");
	 $("#miniRobot").attr("src", "images/minirobotBlue.png");
	 $("#miniRobot").css("visibility", "visible");
	 animate("#blueFieldBig", "zoomIn");
	}

	if($("#redAlliance1").is(':checked') || $("#redAlliance2").is(':checked') || $("#redAlliance3").is(':checked')) {
    $("#redFieldSmall").css("visibility", "visible");
    $("#miniRobot").attr("src", "images/minirobotRed.png");
    $("#miniRobot").css("visibility", "visible");
    animate("#redFieldBig", "zoomIn");
	}

  var left = 344;
  var widthRatio = 1.065789474;

  var midline = (162/widthRatio) + 344;
  var retrieval = (83.238/widthRatio) + 344;
  var key = (57.8553009/widthRatio) + 344;

	if($("#blueAlliance1").is(':checked')) {
    $("#miniRobot").css("left", key + "px");
    //NetworkTables.putValue("/SmartDashboard/startPosition", 1);
  }
	else if($("#blueAlliance2").is(':checked'))	{
    $("#miniRobot").css("left", midline + "px");
    //NetworkTables.putValue("/SmartDashboard/startPosition", 2);
  }
	else if($("#blueAlliance3").is(':checked'))	{
    $("#miniRobot").css("left", (668)-(retrieval-344) + "px");
    //NetworkTables.putValue("/SmartDashboard/startPosition", 3);
  }

	else if($("#redAlliance1").is(':checked')) {
    $("#miniRobot").css("left", retrieval + "px");
    //NetworkTables.putValue("/SmartDashboard/startPosition", 4);
  }
	else if($("#redAlliance2").is(':checked')) {
    $("#miniRobot").css("left", midline + "px");
    //NetworkTables.putValue("/SmartDashboard/startPosition", 5);
  }
	else if($("#redAlliance3").is(':checked')) {
    $("#miniRobot").css("left", 646-(key-344) + "px");
    //NetworkTables.putValue("/SmartDashboard/startPosition", 6);
  }

	dashboardInit();
}

function initAllianceSelection() {
  //NetworkTables.addRobotConnectionListener(onRobotConnection, true);
  //.addGlobalListener(onValueChanged, true);

	animate("#robo", "pulse");
	setTimeout(function () {
		animate("#logoBegin", "pulse");
	}, 300);
	setTimeout(function () {
		animate("#colorSelection", "pulse");
 }, 600);
}

function hopperChoiceSubmit() {
  var hopperChoice = 0;
  console.log("Hopper submitted");
  if ($("#redHopper").is(':checked')) {
    hopperChoice = 5;
  } else if ($("#orangeHopper").is(':checked')) {
    hopperChoice = 4;
  } else if ($("#greenHopper").is(':checked')) {
    hopperChoice = 3;
  } else if ($("#blueHopper").is(':checked')) {
    hopperChoice = 1;
  } else if ($("#purpleHopper").is(':checked')) {
    hopperChoice = 2;
  }
  //NetworkTables.putValue("/SmartDashboard/hopperChoice", hopperChoice);
  animate("#chooseHopper", "fadeOutDown");
  console.log(hopperChoice);
  $("#hopperChoiceLabel").text("Hopper: " + hopperChoice);
}

function autoStep2() {
	console.log("Moving to auto step 2");
	$("#Hopper1, #Gear1, #Dump1, #Nothing1, #submitStep1-1").prop("disabled", true);
	if ($("#Hopper1").is(':checked')) {
		animate("#auto2", "fadeInUp");
	} else if ($("#Gear1").is(':checked')) {
    dash.autoModes = 6;
		$("#autoModeNumber").text(dash.autoModes);
		$("#autoModeLabel").text("Gear");
    $("#hopperChoiceLabel").text("No Hopper Choice");
		finalAutoSubmit();
	} else if ($("#Cross1").is(':checked')) {
    dash.autoModes = 5;
		$("#autoModeNumber").text(dash.autoModes);
		$("#autoModeLabel").text("Cross Baseline");
    $("#hopperChoiceLabel").text("No Hopper Choice");
		finalAutoSubmit();
	} else if ($("#Nothing1").is(':checked')) {
		dash.autoModes = 7;
		$("#autoModeNumber").text(dash.autoModes);
		$("#autoModeLabel").text("Nothing");
    $("#hopperChoiceLabel").text("No Hopper Choice");
		finalAutoSubmit();
	}
}

function finalAutoSubmit() {

	console.log("Final auto submitted");
	animate("#auto1", "fadeOutDown");
	if ($("#auto2").css("visibility")==="visible") {
		if($("#Dump2").is(':checked')) {
			dash.autoModes = 1;
			$("#autoModeNumber").text(dash.autoModes);
			$("#autoModeLabel").text("Hopper, then Low Goal");
		} else if($("#Nothing2").is(':checked')) {
			dash.autoModes = 2;
			$("#autoModeNumber").text(dash.autoModes);
			$("#autoModeLabel").text("Hopper, then Nothing");
		}
		animate("#auto2", "fadeOutDown");
    animate("#chooseHopper", "fadeInUp");
	}
	console.log(dash.autoModes);
	//NetworkTables.putValue("/SmartDashboard/autoMode", dash.autoModes);
}
