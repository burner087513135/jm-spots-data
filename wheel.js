let allLocations = [];
let hiddenUnlocked = false;

const PASSWORD = "gumigoo"; // same password as map

const wheelBox = document.getElementById("wheelBox");
const resultBox = document.getElementById("result");

function getAllowedLocations() {
  if (hiddenUnlocked) {
    return allLocations;
  }
  return allLocations.filter(loc => !loc.hidden);
}

function spinWheel() {
  const allowed = getAllowedLocations();

  if (allowed.length === 0) {
    alert("No locations available");
    return;
  }

  let counter = 0;
  const spinTime = 2000;
  const intervalTime = 80;

  const spinInterval = setInterval(() => {
    const randomLoc = allowed[Math.floor(Math.random() * allowed.length)];
    wheelBox.textContent = randomLoc.name;
    counter += intervalTime;
  }, intervalTime);

  setTimeout(() => {
    clearInterval(spinInterval);

    const chosen = allowed[Math.floor(Math.random() * allowed.length)];

    wheelBox.textContent = chosen.name;

    resultBox.innerHTML = `
      <b>Chosen:</b> ${chosen.name}<br>
      ${chosen.description}<br><br>
      <a href="${chosen.maps_link}" target="_blank">Open in Google Maps</a>
    `;
  }, spinTime);
}

function unlockHidden() {
  const pass = prompt("Enter password:");

  if (pass === PASSWORD) {
    hiddenUnlocked = true;
    alert("Hidden locations unlocked");
  } else {
    alert("Wrong password");
  }
}

// load locations
fetch("./locations.json")
  .then(res => res.json())
  .then(data => {
    allLocations = data;
  })
  .catch(err => {
    console.log("Failed to load locations.json", err);
    alert("Could not load locations.json");
  });

document.getElementById("spinBtn").addEventListener("click", spinWheel);
document.getElementById("unlockBtn").addEventListener("click", unlockHidden);
