console.log("spots.js loaded");

const map = L.map('map').setView([35.95, 14.40], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

let allSpots = [];
let hiddenUnlocked = false;
let markers = [];


/* LOAD DATA */
async function loadSpots() {

  try {

    console.log("fetching json...");

    // VERY IMPORTANT:
    // no ./ sometimes fixes github pages path issues
    const response = await fetch('locations.json');

    console.log("response:", response);

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    allSpots = await response.json();

    console.log("json loaded:", allSpots);

    renderSpots();

  } catch (err) {

    console.error("JSON LOAD FAILED:", err);

  }
}


/* DRAW MARKERS */
function renderSpots() {

  console.log("rendering spots");

  markers.forEach(marker => {
    map.removeLayer(marker);
  });

  markers = [];

  allSpots.forEach(spot => {

    console.log("spot:", spot.name);

    // HIDE SECRET ONES
    if (spot.hidden && !hiddenUnlocked) {
      return;
    }

    const marker = L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(`
        <b>${spot.name}</b><br>
        ${spot.description}<br><br>

        <a href="${spot.maps_link}" target="_blank">
          Open in Maps
        </a>
      `);

    markers.push(marker);

  });

  console.log("markers drawn:", markers.length);
}


/* PAGE READY */
window.onload = () => {

  console.log("window loaded");

  const btn = document.getElementById("revealBtn");

  btn.onclick = () => {

    console.log("button clicked");

    const password = prompt("Enter password:");

    console.log("password:", password);

    if (password === "gumigoo") {

      console.log("unlocking");

      hiddenUnlocked = true;

      renderSpots();

      alert("Hidden locations unlocked");

    } else {

      alert("Wrong password");

    }
  };

  loadSpots();
};
