document.addEventListener("DOMContentLoaded", function () {
  // --- Elemen DOM ---
  const navbar = document.getElementById("navbar");
  const logo = document.getElementById("logo");
  const desktopMenu = document.getElementById("desktop-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const darkModeToggles = document.querySelectorAll(".dark-mode-toggle");

  // --- State ---
  let isMobileMenuOpen = false;
  let isDarkMode = localStorage.getItem("theme") === "dark";

  // --- Fungsi Dark Mode ---
  const updateDarkMode = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");

      // Update Ikon Desktop
      document.getElementById("sun-icon-desktop").classList.remove("hidden");
      document.getElementById("moon-icon-desktop").classList.add("hidden");
      // Update Teks Mobile
      document.getElementById("dark-mode-text-mobile").textContent =
        "Light Mode";
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");

      // Update Ikon Desktop
      document.getElementById("sun-icon-desktop").classList.add("hidden");
      document.getElementById("moon-icon-desktop").classList.remove("hidden");
      // Update Teks Mobile
      document.getElementById("dark-mode-text-mobile").textContent =
        "Dark Mode";
    }
    // Panggil handleScroll untuk update warna navbar segera
    handleScroll();
  };

  darkModeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      updateDarkMode();
    });
  });

  // --- Fungsi untuk Toggle Menu Mobile ---
  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
    mobileMenu.classList.toggle("open", isMobileMenuOpen);
    mobileMenu.classList.toggle("opacity-0", !isMobileMenuOpen);
    hamburgerIcon.classList.toggle("hidden", isMobileMenuOpen);
    closeIcon.classList.toggle("hidden", !isMobileMenuOpen);
  };

  mobileMenuButton.addEventListener("click", toggleMobileMenu);

  // --- Logika untuk Scroll ---
  const handleScroll = () => {
    const isScrolled = window.scrollY > 50;

    // 1. Ubah Background Navbar
    if (isScrolled) {
      navbar.classList.remove(
        "bg-gradient-to-b",
        "from-black/50",
        "to-transparent"
      );
      if (isDarkMode) {
        navbar.classList.add("bg-gray-900/95", "backdrop-blur-md", "shadow-lg");
        navbar.classList.remove("bg-white/95");
      } else {
        navbar.classList.add("bg-white/95", "backdrop-blur-md", "shadow-lg");
        navbar.classList.remove("bg-gray-900/95");
      }
    } else {
      navbar.classList.add(
        "bg-gradient-to-b",
        "from-black/50",
        "to-transparent"
      );
      navbar.classList.remove(
        "bg-white/95",
        "bg-gray-900/95",
        "backdrop-blur-md",
        "shadow-lg"
      );
    }

    // 2. Ubah Warna Teks & Ikon
    const desktopLinks = desktopMenu.querySelectorAll("a");
    const darkModeToggleDesktop = document.getElementById(
      "dark-mode-toggle-desktop"
    );
    const mobileMenuButtonIcon =
      mobileMenuButton.querySelector("svg:not(.hidden)");

    if (isScrolled) {
      logo.classList.remove("text-white");
      logo.classList.add(
        "bg-gradient-to-r",
        "from-blue-600",
        "to-blue-400",
        "bg-clip-text",
        "text-transparent"
      );

      if (isDarkMode) {
        desktopLinks.forEach((link) => {
          link.classList.add("text-white", "hover:text-blue-300");
          link.classList.remove("text-black", "hover:text-blue-600");
        });
        darkModeToggleDesktop.classList.add("text-yellow-300");
        darkModeToggleDesktop.classList.remove("text-gray-600", "text-white");
        mobileMenuButton.setAttribute("stroke", "white");
      } else {
        desktopLinks.forEach((link) => {
          link.classList.add("text-black", "hover:text-blue-600");
          link.classList.remove("text-white", "hover:text-blue-300");
        });
        darkModeToggleDesktop.classList.add("text-gray-600");
        darkModeToggleDesktop.classList.remove("text-yellow-300", "text-white");
        mobileMenuButton.setAttribute("stroke", "#1e40af"); // warna biru
      }
    } else {
      // Saat di atas
      logo.classList.add("text-white");
      logo.classList.remove(
        "bg-gradient-to-r",
        "from-blue-600",
        "to-blue-400",
        "bg-clip-text",
        "text-transparent"
      );

      desktopLinks.forEach((link) => {
        link.classList.add("text-white", "hover:text-blue-300");
        link.classList.remove("text-black", "hover:text-blue-600");
      });

      darkModeToggleDesktop.classList.add("text-white");
      darkModeToggleDesktop.classList.remove(
        "text-yellow-300",
        "text-gray-600"
      );
      mobileMenuButton.setAttribute("stroke", "white");
    }

    // 3. Highlight Link Aktif
    let currentActive = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (
        window.scrollY >= sectionTop - 100 &&
        window.scrollY < sectionTop + sectionHeight - 100
      ) {
        currentActive = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const linkId = link.getAttribute("href").substring(1);
      // Desktop active state
      const underline = link.querySelector(".active-underline");
      if (linkId === currentActive) {
        // Desktop
        link.classList.add(isScrolled ? "text-blue-400" : "text-blue-300");
        if (underline) {
          underline.className = `active-underline absolute -bottom-1 left-0 right-0 h-0.5 ${
            isScrolled ? "bg-blue-400" : "bg-blue-300"
          }`;
        }
        // Mobile
        if (isDarkMode) {
          link.classList.add("bg-blue-900/50", "text-blue-300", "font-medium");
        } else {
          link.classList.add("bg-blue-50", "text-blue-600", "font-medium");
        }
      } else {
        link.classList.remove("text-blue-400", "text-blue-300");
        if (underline) {
          underline.className = "active-underline"; // Hapus kelas background
        }
        // Mobile
        link.classList.remove(
          "bg-blue-900/50",
          "text-blue-300",
          "font-medium",
          "bg-blue-50",
          "text-blue-600"
        );
      }
    });
  };

  window.addEventListener("scroll", handleScroll);

  // --- Logika untuk Smooth Scroll & Tutup Menu Mobile ---
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Cek jika menu mobile terbuka, tutup dulu
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }

      // Smooth scroll tetap berjalan karena `scroll-behavior: smooth` di CSS
      // `e.preventDefault()` tidak diperlukan jika hanya mengandalkan CSS
    });
  });

  // --- Inisialisasi Saat Halaman Dimuat ---
  updateDarkMode(); // Atur tema awal
  handleScroll(); // Atur tampilan navbar awal
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Pilih SEMUA tombol yang memiliki class '.love-button'
  // querySelectorAll akan mengembalikan sebuah daftar (NodeList)
  const allLoveButtons = document.querySelectorAll(".love-button");

  // 2. Lakukan perulangan untuk setiap tombol yang ditemukan
  allLoveButtons.forEach((button) => {
    // 3. Tambahkan event listener ke SETIAP tombol satu per satu
    button.addEventListener("click", function () {
      // 4. Cari ikon yang ada DI DALAM tombol yang sedang diklik ini
      const heartIcon = button.querySelector(".heart-icon");

      // 5. Toggle kelas pada ikon yang spesifik tersebut
      heartIcon.classList.toggle("fill-pink-500");
      heartIcon.classList.toggle("text-pink-500");

      // (Opsional) Efek denyut pada tombol yang diklik
      button.classList.add("scale-125");
      setTimeout(() => {
        button.classList.remove("scale-125");
      }, 150);
    });
  });
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
