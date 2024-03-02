// Set initial values for bars
const initialValues = [50, 30, 70, 40];

// Update value bars and overlays
initialValues.forEach((value, index) => {
  const valueBar = document.getElementById(`valueBar${index + 1}`);
  const overlay = document.getElementById(`overlay${index + 1}`);

  valueBar.style.width = value + '%';
  overlay.innerText = value;
});