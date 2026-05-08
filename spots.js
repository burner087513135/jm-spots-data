const map = L.map('map').setView([35.95, 14.40], 13);

// map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

let allSpots = [];
let hiddenUnlocked = false;

// load data
function loadSpots() {
  fetch("./locations.json")
    .then(res => res.json())
    .then(data => {
      allSpots = data;
      renderSpots();
    })
    .catch(err => {
      console.log("failed to load locations.json", err);
    });
}

// draw markers
function renderSpots() {
  // remove old markers only
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  allSpots.forEach(spot => {
    if (spot.hidden && !hiddenUnlocked) return;

    const popup = `
      <b>${spot.name}</b><br>
      ${spot.description}<br><br>
      <a href="${spot.maps_link}" target="_blank">Open in Google Maps</a>
    `;

    L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(popup);
  });
}

// button setup (runs after page loads)
window.onload = function () {
  const btn = document.getElementById("revealBtn");

  if (!btn) {
    console.log("Reveal button not found");
    return;
  }

  btn.addEventListener("click", () => {
    const password = prompt("Enter password:");

    if (password === "1234") {
      hiddenUnlocked = true;
      renderSpots();
      alert("Hidden locations unlocked");
    } else {
      alert("Wrong password");
    }
  });
};

// start app
loadSpots();
