// Create map
const map = L.map('map').setView([35.95, 14.40], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

let allSpots = [];
let hiddenUnlocked = false;
let markers = [];

// Load locations
async function loadSpots() {
  try {
    const response = await fetch('./locations.json');
    const data = await response.json();

    allSpots = data;

    renderSpots();

  } catch (err) {
    console.error('Failed to load locations.json', err);
  }
}

// Render markers
function renderSpots() {

  // Remove old markers
  markers.forEach(marker => {
    map.removeLayer(marker);
  });

  markers = [];

  // Add markers
  allSpots.forEach(spot => {

    // hide hidden spots unless unlocked
    if (spot.hidden && !hiddenUnlocked) return;

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

// Wait for page to fully load
window.addEventListener('load', () => {

  const btn = document.getElementById('revealBtn');

  if (!btn) {
    console.error('Reveal button not found');
    return;
  }

  btn.addEventListener('click', () => {

    const password = prompt('Enter password:');

    if (password === '1234') {

      hiddenUnlocked = true;

      renderSpots();

      alert('Hidden locations unlocked');

    } else {

      alert('Wrong password');
    }
  });

  // Start app
  loadSpots();
});
