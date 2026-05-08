console.log("spots.js loaded");

/* MAP */
const map = L.map("map").setView([35.95, 14.40], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

/* STATE */
let allSpots = [];
let markers = [];
let hiddenUnlocked = false;
let countdown = 5;

/* UI ELEMENTS */
const info = document.getElementById("info");
const btn = document.getElementById("revealBtn");

/* SAFE UI UPDATE */
function setInfo(html) {
  if (!info) return;
  info.innerHTML = html;
}

/* LOAD DATA */
async function loadSpots() {
  try {
    setInfo("⏳ Loading data...");

    const res = await fetch("locations.json");

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    allSpots = data;

    renderSpots();

    setInfo(`✅ Loaded ${data.length} spots`);

  } catch (err) {
    console.error(err);
    setInfo(`❌ Load failed: ${err.message}`);
  }
}

/* RENDER MARKERS */
function renderSpots() {

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  allSpots.forEach(spot => {

    if (spot.hidden && !hiddenUnlocked) return;

    const marker = L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(`
        <b>${spot.name}</b><br>
        ${spot.description}<br><br>
        <a href="${spot.maps_link}" target="_blank">Open</a>
      `);

    markers.push(marker);
  });

  updateHUD("Rendered markers");
}

/* HUD */
function updateHUD(extra = "") {

  if (!map) return;

  const c = map.getCenter();

  setInfo(`
    <b>Status:</b> ${extra}<br><br>

    <b>Markers:</b> ${markers.length}<br>
    <b>Total Spots:</b> ${allSpots.length}<br>
    <b>Hidden:</b> ${hiddenUnlocked}<br><br>

    <b>Center:</b><br>
    ${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}<br><br>

    <b>Zoom:</b> ${map.getZoom()}<br><br>

    <b>Refresh in:</b> ${countdown}s
  `);
}

/* AUTO REFRESH */
setInterval(async () => {

  countdown--;

  if (countdown <= 0) {
    countdown = 5;
    await loadSpots();
  }

  updateHUD("Running");

}, 1000);

/* MAP EVENTS */
map.on("move", () => updateHUD("Moving map"));

/* BUTTON */
btn.onclick = () => {

  const pass = prompt("Enter password:");

  if (pass === "gumigoo") {

    hiddenUnlocked = true;

    renderSpots();

    setInfo("✅ Hidden locations unlocked");

  } else {
    setInfo("❌ Wrong password");
  }
};

/* START */
window.onload = () => {
  loadSpots();
};
