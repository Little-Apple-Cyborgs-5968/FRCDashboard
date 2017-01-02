5968's custom dashboard, written in HTML, CSS, and JavaScript. It receives data from the robot using the Network Tables, accessed by [pynetworktables2js](https://github.com/robotpy/pynetworktables2js). 
It's based on [this](https://github.com/frcdashboard/frcdashboard) dashboard. 

We added audio queues, to allow every member of the drive team to look
at the field, only having to look at the dashboard if they hear one of the queues. Currently, these are only used to give alerts on the time remaining, at 90, 60, 45
30, 15, 10, and 5 seconds left in the match.

Additionally, the dashboard gets the time directly from the robot, as opposed to managing its own clock as in the original code. While this makes the interval of
one second as viewed on the dashboard somewhat variable, it more accurately accounts for the short break in between auto and teleop.