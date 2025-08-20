// GANTI SEMUA KODE JAVASCRIPT NAVIGASI ANDA DENGAN INI
document.addEventListener("DOMContentLoaded", function () {
  // =================================================================
  // 1. MEMILIH SEMUA ELEMEN DOM YANG DIPERLUKAN
  // =================================================================
  const navbar = document.querySelector("nav");
  const logo = document.getElementById("logo");
  const navLinksContainer = document.getElementById("navLinksContainer");
  
  // Elemen-elemen khusus untuk Menu Mobile
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  // =================================================================
  // 2. STATE (STATUS SAAT INI)
  // =================================================================
  let isMobileMenuOpen = false;

  // =================================================================
  // 3. FUNGSI UNTUK MENU MOBILE (YANG KEMUNGKINAN HILANG)
  // =================================================================
  const toggleMobileMenu = () => {
    // Jika tombolnya tidak ada, jangan lakukan apa-apa
    if (!mobileMenu || !hamburgerIcon || !closeIcon) return;

    // Ubah status buka/tutup
    isMobileMenuOpen = !isMobileMenuOpen;
    
    // Tambah/hapus kelas 'open' untuk memicu animasi CSS
    mobileMenu.classList.toggle("open", isMobileMenuOpen);
    
    // Tampilkan/sembunyikan ikon hamburger dan silang
    hamburgerIcon.classList.toggle("hidden", isMobileMenuOpen);
    closeIcon.classList.toggle("hidden", !isMobileMenuOpen);
  };

  // =================================================================
  // 4. FUNGSI UNTUK EFEK SCROLL (YANG SUDAH BEKERJA)
  // =================================================================
  const handleScroll = () => {
    if (!navbar) return;

    const isScrolled = window.scrollY > 50;

    if (isScrolled) {
      navbar.classList.remove("from-black/50", "to-transparent");
      navbar.classList.add("bg-gray-900/70", "backdrop-blur-md", "shadow-lg");
    } else {
      navbar.classList.remove("bg-gray-900/70", "backdrop-blur-md", "shadow-lg");
      navbar.classList.add("from-black/50", "to-transparent");
    }
  };

  // =================================================================
  // 5. EVENT LISTENERS (PENGAIT FUNGSI KE AKSI PENGGUNA)
  // =================================================================

  // Saat tombol hamburger/silang diklik, panggil fungsi toggleMobileMenu
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", toggleMobileMenu);
  }

  // Saat pengguna scroll halaman, panggil fungsi handleScroll
  window.addEventListener("scroll", handleScroll);

  // Saat salah satu link di menu mobile diklik, tutup menunya
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  // =================================================================
  // 6. INISIALISASI
  // =================================================================
  // Atur tampilan navbar sesuai posisi scroll saat halaman pertama kali dimuat
  handleScroll();
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
