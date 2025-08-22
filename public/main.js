document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector("nav");
  const logo = document.getElementById("logo");
  const navLinksContainer = document.getElementById("navLinksContainer");

  // Elemen-elemen khusus untuk Menu Mobile
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    if (!mobileMenu || !hamburgerIcon || !closeIcon) return;
    isMobileMenuOpen = !isMobileMenuOpen;

    mobileMenu.classList.toggle("open", isMobileMenuOpen);

    hamburgerIcon.classList.toggle("hidden", isMobileMenuOpen);
    closeIcon.classList.toggle("hidden", !isMobileMenuOpen);
  };

  const handleScroll = () => {
    if (!navbar) return;

    const isScrolled = window.scrollY > 50;

    if (isScrolled) {
      navbar.classList.remove("from-black/50", "to-transparent");
      navbar.classList.add("bg-gray-900/70", "backdrop-blur-md", "shadow-lg");
    } else {
      navbar.classList.remove(
        "bg-gray-900/70",
        "backdrop-blur-md",
        "shadow-lg"
      );
      navbar.classList.add("from-black/50", "to-transparent");
    }
  };

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", toggleMobileMenu);
  }

  window.addEventListener("scroll", handleScroll);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  handleScroll();
});

document.addEventListener("DOMContentLoaded", function () {
  const allLoveButtons = document.querySelectorAll(".love-button");

  allLoveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const heartIcon = button.querySelector(".heart-icon");

      heartIcon.classList.toggle("fill-pink-500");
      heartIcon.classList.toggle("text-pink-500");

      button.classList.add("scale-125");
      setTimeout(() => {
        button.classList.remove("scale-125");
      }, 150);
    });
  });
});

// User Profile Dropdown
// Ambil elemen tombol dan dropdown dari HTML
const profileButton = document.getElementById("profile-button");
const profileDropdown = document.getElementById("profile-dropdown");

// Variabel untuk animasi (agar lebih mulus)
let isDropdownOpen = false;

// Fungsi untuk menampilkan/menyembunyikan dropdown
const toggleDropdown = () => {
  isDropdownOpen = !isDropdownOpen;
  if (isDropdownOpen) {
    // Tampilkan dropdown dan mulai animasi "enter"
    profileDropdown.classList.remove("hidden");
    // Sedikit jeda agar browser sempat me-render sebelum animasi dimulai
    requestAnimationFrame(() => {
      profileDropdown.classList.remove("opacity-0", "scale-95");
      profileDropdown.classList.add("opacity-100", "scale-100");
    });
  } else {
    // Mulai animasi "leave"
    profileDropdown.classList.remove("opacity-100", "scale-100");
    profileDropdown.classList.add("opacity-0", "scale-95");
    // Sembunyikan elemen setelah animasi selesai
    setTimeout(() => {
      profileDropdown.classList.add("hidden");
    }, 200); // Durasi harus cocok dengan durasi transisi
  }
};

// Tambahkan event listener saat tombol profil di-klik
profileButton.addEventListener("click", (event) => {
  // Mencegah event "klik di luar" tertrigger secara bersamaan
  event.stopPropagation();
  toggleDropdown();
});

// Tambahkan event listener untuk menutup dropdown saat klik di luar area menu
window.addEventListener("click", (event) => {
  if (
    isDropdownOpen &&
    !profileDropdown.contains(event.target) &&
    !profileButton.contains(event.target)
  ) {
    toggleDropdown();
  }
});

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
document.addEventListener("DOMContentLoaded", () => {
  const myLocation = [-5.11218, 105.18437];
  const mymap = L.map("mapid").setView(myLocation, 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mymap);

  const redIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.marker(myLocation, { icon: redIcon })
    .addTo(mymap)
    .bindPopup("<b>Apparels 16</b><br>Toko Baju Terbaik di Kota Ini.")
    .openPopup();
});
