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
const panel = document.getElementById("devPanel");
const info = document.getElementById("info");
const btn = document.getElementById("revealBtn");
const toggle = document.getElementById("togglePanel");

/* STATUS */
function setInfo(html) {
  info.innerHTML = html;
}

/* MINIMIZE / EXPAND */
let minimized = false;

toggle.onclick = () => {
  minimized = !minimized;

  if (minimized) {
    panel.classList.add("minimized");
    toggle.innerText = "+";
  } else {
    panel.classList.remove("minimized");
    toggle.innerText = "_";
  }
};

/* DRAGGING */
const header = document.querySelector(".dev-header");

let isDragging = false;
let offsetX, offsetY;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - panel.offsetLeft;
  offsetY = e.clientY - panel.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  panel.style.left = (e.clientX - offsetX) + "px";
  panel.style.top = (e.clientY - offsetY) + "px";
  panel.style.right = "auto";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

/* FETCH DATA */
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

/* AUTO REFRESH LOOP */
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
    setInfo(`<span class="ok">Unlocked hidden locations</span>`);
  } else {
    setInfo(`<span class="warn">Wrong password</span>`);
  }
};

/* START */
window.onload = () => {
  loadSpots();
};
