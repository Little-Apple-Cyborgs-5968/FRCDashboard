function switchCam(e) { // Switch camera feeds on key press
 // blue is 1, green is 2
 if (e.keyCode == 61) { // equals/plus button
	 if ($("#camera1").css("visibility")==="visible") {
		 $("#camera1").css("visibility", "hidden");
		 $("#camera2").css("visibility", "visible");
     $("#camLabel").text("Gear Camera");
	 } else if ($("#camera2").css("visibility")==="visible") {
		 $("#camera2").css("visibility", "hidden");
		 $("#camera1").css("visibility", "visible");
     $("#camLabel").text("Hopper Camera");
	 }
  }
 }

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
