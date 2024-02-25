// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    robotDiagram: {
        arm: document.getElementById('robot-arm')
    },
    example: {
        button: document.getElementById('example-button'),
        readout: document.getElementById('example-readout').firstChild
    },
    autoSelect: document.getElementById('auto-select'),
    armPosition: document.getElementById('arm-position')
};

// Key Listeners

// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    document.getElementById('needle').style.transform = 'translateX(-50%) translateY(-100%) rotate(' + ui.gyro.visualVal + 'deg)';
    angleValueDisplay.innerText = ui.gyro.visualVal;
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.textContent = ui.gyro.visualVal + 'º';
};
NetworkTables.addKeyListener('/SmartDashboard/yaw', updateGyro);

// The following case is an example, for a robot with an arm at the front.
NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
    // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
    if (value > 1140) {
        value = 1140;
    }
    else if (value < 0) {
        value = 0;
    }
    // Calculate visual rotation of arm
    var armAngle = value * 3 / 20 - 45;
    // Rotate the arm in diagram to match real arm
    ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
});

// This button is just an example of triggering an event on the robot by clicking a button.
NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
    // Set class active if value is true and unset it if it is false
    ui.example.button.classList.toggle('active', value);
    ui.example.readout.data = 'Value is ' + value;
});

NetworkTables.addKeyListener('/SmartDashboard/frontRightMotor', (key, value) => {
    // Update the motor speed, rounding to three decimal points
    updateMotorSpeed('1', Math.round((value * 10000)/100));
});

NetworkTables.addKeyListener('/SmartDashboard/frontLeftMotor', (key, value) => {
    // Update the motor speed, rounding to three decimal points
    updateMotorSpeed('2', Math.round(value * 100));
});

NetworkTables.addKeyListener('/SmartDashboard/rearRightMotor', (key, value) => {
    // Update the motor speed, rounding to three decimal points
    updateMotorSpeed('3', Math.round(value * 100));
});

NetworkTables.addKeyListener('/SmartDashboard/rearLeftMotor', (key, value) => {
    // Update the motor speed, rounding to three decimal points
    updateMotorSpeed('4', Math.round(value * 100));
});

function updateMotorSpeed(barId, speed) {
    /*const bar = document.getElementById(barId);
    if (bar) {
        bar.dataset.motorSpeed = speed;
        const motorSpan = bar.querySelector('.overlay span');
        if (motorSpan) {
            motorSpan.textContent = speed;
        }
    }*/
    const valueBar = document.getElementById(`valueBar${barId}`);
    const overlay = document.getElementById(`overlay${barId}`);
    
    // Check if the value is negative
    if (speed < 0) {
        valueBar.style.backgroundColor = 'red'; // Set background color to red for negative values
    } else {
        valueBar.style.backgroundColor = '#3498db'; // Set background color to default for non-negative values
    }
    
    valueBar.style.width = Math.abs(speed) + '%'; // Set width to positive value
    overlay.innerText = speed;
}



NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/Auto\ List', (key, value) => {
    // Clear previous list
    while (ui.autoSelect.firstChild) {
        ui.autoSelect.removeChild(ui.autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        ui.autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/Autonomous\ Mode/selected', (key, value) => {
    ui.autoSelect.value = value;
});

// The rest of the doc is listeners for UI elements being clicked on
ui.example.button.onclick = function() {
    // Set NetworkTables values to the opposite of whether button has active class.
    NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
};
// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/Autonomous\ Mode/selected', this.value);
};
// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function() {
    NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};

addEventListener('error', (ev) => {
    window.api.sendWindowError({
		mesg: ev.message,
		file: ev.filename,
		lineNumber: ev.lineno
	});
});
