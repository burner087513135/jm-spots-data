console.log("spots.js loaded");

/* MAP */
const map = L.map('map').setView([35.95, 14.40], 13);

/* TILES */
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

/* VARIABLES */
let allSpots = [];
let hiddenUnlocked = false;
let markers = [];

let refreshCountdown = 5;

const devInfo = document.getElementById("devInfo");

/* LOAD SPOTS */
async function loadSpots() {

  try {

    updateStatus("Fetching latest locations...", "normal");

    const response = await fetch(
      `locations.json?v=${Date.now()}`
    );

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    allSpots = await response.json();

    renderSpots();

    updateStatus("Locations updated successfully", "success");

  } catch (err) {

    console.error(err);

    updateStatus(
      "JSON LOAD FAILED: " + err.message,
      "error"
    );
  }
}

/* RENDER */
function renderSpots() {

  markers.forEach(marker => {
    map.removeLayer(marker);
  });

  markers = [];

  allSpots.forEach(spot => {

    if (spot.hidden && !hiddenUnlocked) {
      return;
    }

    const popup = `
      <b>${spot.name}</b><br>
      ${spot.description}<br><br>

      <a href="${spot.maps_link}" target="_blank">
        Open in Maps
      </a>
    `;

    const marker = L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(popup);

    markers.push(marker);

  });

  updateDevPanel();
}

/* DEV PANEL UPDATE */
function updateDevPanel(extra = "") {

  const center = map.getCenter();

  const zoom = map.getZoom();

  devInfo.innerHTML = `

    <b>Status:</b>
    ${extra || "Running"}<br><br>

    <b>Visible Markers:</b>
    ${markers.length}<br>

    <b>Hidden Unlocked:</b>
    ${hiddenUnlocked}<br>

    <b>Map Center:</b><br>
    ${center.lat.toFixed(5)},
    ${center.lng.toFixed(5)}<br><br>

    <b>Zoom:</b>
    ${zoom}<br><br>

    <b>Auto Refresh:</b>
    ${refreshCountdown}s<br><br>

    <b>Total Spots:</b>
    ${allSpots.length}

  `;
}

/* STATUS */
function updateStatus(text, type = "normal") {

  let cls = "";

  if (type === "success") {
    cls = "success";
  }

  if (type === "error") {
    cls = "error";
  }

  updateDevPanel(
    `<span class="${cls}">${text}</span>`
  );
}

/* AUTO REFRESH */
setInterval(async () => {

  refreshCountdown--;

  if (refreshCountdown <= 0) {

    refreshCountdown = 5;

    await loadSpots();
  }

  updateDevPanel();

}, 1000);

/* MAP MOVE UPDATE */
map.on("move", () => {
  updateDevPanel();
});

/* BUTTON */
window.onload = () => {

  console.log("window loaded");

  const btn = document.getElementById("revealBtn");

  btn.onclick = () => {

    const password = prompt("Enter password:");

    if (password === "gumigoo") {

      hiddenUnlocked = true;

      renderSpots();

      updateStatus(
        "Hidden locations unlocked",
        "success"
      );

    } else {

      updateStatus(
        "Wrong password",
        "error"
      );
    }
  };

  loadSpots();

};
