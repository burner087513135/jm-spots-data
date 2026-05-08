const map = L.map('map').setView([35.95, 14.40], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

let allSpots = [];
let hiddenUnlocked = false;

function loadSpots() {
  fetch("./locations.json")
    .then(res => res.json())
    .then(data => {
      allSpots = data;
      renderSpots();
    });
}

function renderSpots() {
  // clear map
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
      <a href="${spot.maps_link}" target="_blank">Open in Maps</a>
    `;

    L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(popup);
  });
}

// button logic
document.getElementById("revealBtn").addEventListener("click", () => {
  const password = prompt("Enter password:");

  if (password === "myfavoritecolourisPURPLE") {
    hiddenUnlocked = true;
    renderSpots();
    alert("Hidden spots unlocked");
  } else {
    alert("Wrong password");
  }
});

loadSpots();
