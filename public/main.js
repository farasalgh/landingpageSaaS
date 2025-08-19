// --- FAQ Accordion Animation
document.addEventListener("DOMContentLoaded", () => {
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    const content = header.nextElementSibling;
    const icon = header.querySelector("svg");

    content.style.maxHeight = "0px";

    header.addEventListener("click", () => {
      const isOpen = content.style.maxHeight !== "0px";

      if (isOpen) {
        content.style.maxHeight = "0px";
        icon.style.transform = "rotate(0deg)";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
      }
    });
  });
});

// Map
document.addEventListener('DOMContentLoaded', () => {
    const myLocation = [-5.11218, 105.18437]; 
    const mymap = L.map('mapid').setView(myLocation, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    const redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.marker(myLocation, { icon: redIcon }).addTo(mymap)
        .bindPopup('<b>Apparels 16</b><br>Toko Baju Terbaik di Kota Ini.').openPopup();
});