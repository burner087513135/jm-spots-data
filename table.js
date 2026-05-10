let showHidden = false;
let locations = [];

async function loadlocations() {
  try {
    const res = await fetch("locations.json");
    locations = await res.json();

    // sort A-Z by name
    locations.sort((a, b) => a.name.localeCompare(b.name));

    renderTable();
  } catch (err) {
    console.error("Failed to load locations.json", err);
  }
}

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  locations.forEach(spot => {
    if (spot.hidden === true && showHidden === false) return;

    const row = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = spot.name;

    const descTd = document.createElement("td");
    descTd.textContent = spot.description;

    const linkTd = document.createElement("td");
    const link = document.createElement("a");
    link.href = spot.maps_link;
    link.target = "_blank";
    link.textContent = "Location";
    linkTd.appendChild(link);

    row.appendChild(nameTd);
    row.appendChild(descTd);
    row.appendChild(linkTd);

    tableBody.appendChild(row);
  });
}

document.getElementById("devBtn").addEventListener("click", () => {
  const pass = prompt("password:");

  if (pass === "gumigoo") {
    showHidden = true;
    alert("Hidden locations unlocked.");
    renderTable();
  } else {
    alert("Wrong password.");
  }
});

loadlocations();
