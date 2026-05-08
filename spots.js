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
    const response = await fetch(`locations.json?v=${Date.now()}`);

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
