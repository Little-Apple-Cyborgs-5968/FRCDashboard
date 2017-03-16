// cd FRCDashboard/camera_feeds
// python -3 -m pynetworktables2js --port 4000 --robot 10.59.68.11
// cd C:\Program Files (x86)\Google\Chrome\Application
// chrome.exe --app=localhost:4000

function switchCam(e) { // Switch camera feeds on key press
 // blue is 1, green is 2
 if (e.keyCode != 32 && e.keyCode!= 13) { // equals/plus button
	 if ($("#camera1").css("visibility")==="visible") {
		 $("#camera1").css("visibility", "hidden");
		 $("#camera2").css("visibility", "visible");
         $("#camLabel").text("Hopper camera");
	 } else if ($("#camera2").css("visibility")==="visible") {
		 $("#camera2").css("visibility", "hidden");
		 $("#camera1").css("visibility", "visible");
         $("#camLabel").text("Gear Camera");
	 }
  }
 }

 console.log("it's okay");
 NetworkTables.addKeyListener('/SmartDashboard/reversed', function(key, value, isNew){
    console.log("no here");
 	console.log("here");
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
	 value = true;
	} else if (value == 'false') {
	 value = false;
	}
 	if(key === '/SmartDashboard/reversed') {
 		if(value) {
	 		$("#camera2").css("visibility", "hidden");
			$("#camera1").css("visibility", "visible");
	        $("#camLabel").text("Gear Camera");
 		} else {
	 		$("#camera1").css("visibility", "hidden");
			$("#camera2").css("visibility", "visible");
	        $("#camLabel").text("Hopper camera");
 		}
 	}
}, true);

 function cameraSelect() {
  animate("#camLabel", "fadeInRight");
  $("#cameraSelection").css("visibility", "hidden");
  if ($("#camera8070").is(':checked')) {
 	 $("#camera1").css("visibility", "visible");
 	 $("#camera1").addClass("animated fadeInRight");
 	 $("#camera2").css("visibility", "hidden");
   $("#camLabel").text("Hopper Camera");
  } else if ($("#camera8080").is(':checked')) {
 	 $("#camera2").css("visibility", "visible");
 	 $("#camera2").addClass("animated fadeInRight");
 	 $("#camera1").css("visibility", "hidden");
   $("#camLabel").text("Gear Camera");
  }
 }

function startSelect() {
  animate("#cameraSelection", "fadeInRight");
}

function animate(element_ID, animation) {
	 $(element_ID).css("visibility", "visible");
	 $(element_ID).addClass("animated");
	 $(element_ID).addClass(animation);
}
