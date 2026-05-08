// CREATE MAP
const map = L.map('map').setView([35.95, 14.40], 13);

// MAP TILES
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// VARIABLES
let allSpots = [];
let hiddenUnlocked = false;
let markers = [];

// LOAD JSON DATA
async function loadSpots() {

  try {

    const response = await fetch('./locations.json');

    const data = await response.json();

    allSpots = data;

    renderSpots();

  } catch (err) {

    console.error("Failed to load locations.json", err);

  }
}

// RENDER MARKERS
function renderSpots() {

  // REMOVE OLD MARKERS
  markers.forEach(marker => {
    map.removeLayer(marker);
  });

  markers = [];

  // ADD NEW MARKERS
  allSpots.forEach(spot => {

    // HIDE SECRET SPOTS
    if (spot.hidden && !hiddenUnlocked) {
      return;
    }

    const popup = `
      <b>${spot.name}</b><br>
      ${spot.description}<br><br>

      <a href="${spot.maps_link}" target="_blank">
        Open in Google Maps
      </a>
    `;

    const marker = L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(popup);

    markers.push(marker);

  });
}

// PAGE LOADED
window.addEventListener("load", () => {

  // BUTTON
  const btn = document.getElementById("revealBtn");

  // CLICK EVENT
  btn.onclick = () => {

    const password = prompt("Enter password:");

    if (password === "1234") {

      hiddenUnlocked = true;

      renderSpots();

      alert("Hidden locations unlocked");

    } else {

      alert("Wrong password");

    }
  };

  // START
  loadSpots();

});
