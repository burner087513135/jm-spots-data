console.log("spots.js loaded");

/* =======================
   MAP
======================= */
const map = L.map("map").setView([35.95, 14.40], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

/* =======================
   STATE
======================= */
let allSpots = [];
let markers = [];
let hiddenUnlocked = false;
let countdown = 5;

/* =======================
   UI ELEMENTS
======================= */
const panel = document.getElementById("devPanel");
const info = document.getElementById("info");
const toggleBtn = document.getElementById("togglePanelBtn");

/* =======================
   STATUS DISPLAY
======================= */
function setInfo(html) {
  info.innerHTML = html;
}

/* =======================
   MINIMIZE / MAXIMIZE
======================= */
let minimized = false;

toggleBtn.onclick = () => {
  minimized = !minimized;

  if (minimized) {
    panel.classList.add("minimized");
    toggleBtn.innerText = "Maximize Panel";
  } else {
    panel.classList.remove("minimized");
    toggleBtn.innerText = "Minimize Panel";
  }
};

/* =======================
   LOAD SPOTS
======================= */
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
    setInfo(`<span style="color:red;">❌ Load failed: ${err.message}</span>`);
  }
}

/* =======================
   RENDER MARKERS
======================= */
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

/* =======================
   HUD INFO
======================= */
function updateHUD(extra = "") {
  const c = map.getCenter();

  setInfo(`
    <b>Status:</b> ${extra}<br><br>

    <b>Markers:</b> ${markers.length}<br>
    <b>Total Spots:</b> ${allSpots.length}<br>
    <b>Hidden:</b> ${hiddenUnlocked}<br><br>

    <b>Map Center:</b><br>
    ${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}<br><br>

    <b>Zoom:</b> ${map.getZoom()}<br><br>

    <b>Refresh in:</b> ${countdown}s
  `);
}

/* =======================
   AUTO REFRESH LOOP
======================= */
setInterval(async () => {
  countdown--;

  if (countdown <= 0) {
    countdown = 5;
    await loadSpots();
  }

  updateHUD("Running");

}, 1000);

/* =======================
   MAP EVENTS
======================= */
map.on("move", () => updateHUD("Moving map"));

/* =======================
   UNLOCK BUTTON
======================= */
const revealBtn = document.getElementById("revealBtn");

revealBtn.onclick = () => {
  const pass = prompt("Enter password:");

  if (pass === "gumigoo") {
    hiddenUnlocked = true;
    renderSpots();
    setInfo(`<span style="color:lime;">Unlocked hidden locations</span>`);
  } else {
    setInfo(`<span style="color:orange;">Wrong password</span>`);
  }
};

/* =======================
   START
======================= */
window.onload = () => {
  loadSpots();
};
