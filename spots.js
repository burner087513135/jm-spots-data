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

/* UI */
const info = document.getElementById("info");
const btn = document.getElementById("revealBtn");

/* STATUS */
function setInfo(html) {
  info.innerHTML = html;
}

/* FETCH DATA (SAFE) */
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

    setInfo("✅ Loaded " + data.length + " spots");

  } catch (err) {

    console.error(err);

    setInfo(`<span class="err">❌ Load failed: ${err.message}</span>`);
  }
}

/* RENDER MAP */
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

  updateHUD("Rendered " + markers.length + " markers");
}

/* HUD */
function updateHUD(extra = "") {

  const c = map.getCenter();

  setInfo(`
    <b>Current Spots:</b> ${markers.length}<br>
    <b>Total Spots:</b> ${allSpots.length}<br>
    <b>Dev Mode:</b> ${hiddenUnlocked}<br>`);
}

/* AUTO REFRESH LOOP (5s) */
setInterval(async () => {

  countdown--;

  if (countdown <= 0) {
    countdown = 5;
    await loadSpots();
  }

  updateHUD("Running");

}, 1000);

/* MAP MOVEMENT TRACKING */
map.on("move", () => updateHUD("Moving map"));

/* BUTTON */
btn.onclick = () => {

  const pass = prompt("Enter password:");

  if (pass === "gumigoo") {

    hiddenUnlocked = true;

    renderSpots();

    setInfo(`<span class="ok">Unlocked hidden locations</span>`);

  } else {

    setInfo(`<span class="warn">Wrong password</span>`);
  }
};

/* START */
window.onload = () => {
  loadSpots();
};
