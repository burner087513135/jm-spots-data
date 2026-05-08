const map = L.map('map').setView([35.95, 14.40], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

fetch("locations.json")
  .then(res => res.json())
  .then(spots => {
    spots.forEach(spot => {
      const popupContent = `
        <b>${spot.name}</b><br>
        ${spot.description}<br><br>
        <a href="${spot.maps_link}" target="_blank">Open in Google Maps</a>
      `;

      L.marker([spot.lat, spot.lng])
        .addTo(map)
        .bindPopup(popupContent);
    });
  })
  .catch(err => {
    alert("Failed to load locations.json");
    console.error(err);
  });
