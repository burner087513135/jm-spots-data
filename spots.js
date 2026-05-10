document.addEventListener("DOMContentLoaded", () => {
  console.log("spots.js loaded");

  const PASSWORD = "gumigoo";

  /* UI */
  const info = document.getElementById("info");
  const revealBtn = document.getElementById("revealBtn");

  if (!info || !revealBtn) {
    console.error("UI elements missing");
    return;
  }

  function setInfo(html) {
    info.innerHTML = html;
  }

  /* MAP */
  const map = L.map("map").setView([35.95, 14.40], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  /* STATE */
  let allSpots = [];
  let markers = [];
  let hiddenUnlocked = false;

  /* LOAD DATA */
  async function loadSpots() {
    try {
      setInfo("Loading locations...");

      const res = await fetch("./locations.json");

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      allSpots = await res.json();
      renderSpots();
      updateHUD();

    } catch (err) {
      console.error(err);
      setInfo(`<span class="err">❌ Load failed: ${err.message}</span>`);
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
          <a href="${spot.maps_link}" target="_blank">Open in Google Maps</a>
        `);

      markers.push(marker);
    });
  }

  function updateHUD() {
    setInfo(`
      <b>Visible:</b> ${markers.length}<br>
      <b>Total:</b> ${allSpots.length}<br>
      <b>DEV mode:</b> ${hiddenUnlocked}
    `);
  }

  /* BUTTON EVENTS */
  revealBtn.addEventListener("click", () => {
    const pass = prompt("Enter password:");

    if (pass === PASSWORD) {
      hiddenUnlocked = true;
      renderSpots();
      updateHUD();
      alert("Hidden locations unlocked");
    } else {
      alert("Wrong password");
    }
  });

  map.on("move", updateHUD);

  /* START */
  loadSpots();
});
