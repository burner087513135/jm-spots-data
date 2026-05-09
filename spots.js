console.log("spots.js loaded");

const PASSWORD = "gumigoo";

/* MAP */
const map = L.map("map").setView([35.95, 14.40], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

/* STATE */
let allSpots = [];
let markers = [];
let hiddenUnlocked = false;

/* UI */
const info = document.getElementById("info");
const revealBtn = document.getElementById("revealBtn");
const wheelBtn = document.getElementById("wheelBtn");

/* STATUS */
function setInfo(html) {
  info.innerHTML = html;
}

/* FETCH DATA */
async function loadSpots() {
  try {
    setInfo("⏳ Loading locations...");

    const res = await fetch("./locations.json");

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();
    allSpots = data;

    renderSpots();
    setInfo("✅ Loaded " + data.length + " locations");

  } catch (err) {
    console.error(err);
    setInfo(`<span class="err">❌ Load failed: ${err.message}</span>`);
  }
}

/* RENDER MAP */
function renderSpots() {
  // remove old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  allSpots.forEach(spot => {
    if (spot.hidden && !hiddenUnlocked) return;

    const marker = L.marker([spot.lat, spot.lng])
      .addTo(map)
      .bindPopup(`
        <b>${spot.name}</b><br>
        ${spot.description}<br><br>
        <a href="${spot.maps_link}" target="_blank">Open in Google Maps</a>
      `);

    markers.push(marker);
  });

  updateHUD();
}

/* HUD */
function updateHUD() {
  setInfo(`
    <b>Visible Locations:</b> ${markers.length}<br>
    <b>Total Locations:</b> ${allSpots.length}<br>
    <b>Hidden Unlocked:</b> ${hiddenUnlocked}
  `);
}

map.on("move", updateHUD);

/* BUTTONS */
revealBtn.addEventListener("click", () => {
  const pass = prompt("Enter password:");

  if (pass === PASSWORD) {
    hiddenUnlocked = true;
    renderSpots();
    setInfo(`<span class="ok">✅ Hidden locations unlocked</span>`);
    setTimeout(updateHUD, 1200);
  } else {
    setInfo(`<span class="warn">❌ Wrong password</span>`);
    setTimeout(updateHUD, 1200);
  }
});

wheelBtn.addEventListener("click", () => {
  window.location.href = "wheel.html";
});

/* START */
loadSpots();
