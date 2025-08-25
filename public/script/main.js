// Auth User
checkAuthStatus();

// init
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("contact-form")) {
    initContactForm();
  }

  if (document.getElementById("mapid")) {
    initLeafletMap();
  }

  adjustUIVisibilityBasedOnRole();
  displayProducts();
  initLoveButtons();
  initAuthUI();
});

// Di file main.js (di luar event listener DOMContentLoaded)

/**
 * Fungsi global yang dipanggil oleh tombol 'Add to Cart' di HTML.
 * Fungsi ini membaca data-* atribut dari tombol dan memanggil method dari class Cart.
 * @param {HTMLElement} button - Elemen tombol yang diklik.
 */
// GANTI FUNGSI LAMA ANDA DENGAN VERSI DEBUGGING INI
function addItemToCart(button) {
  // Baris ini akan membersihkan console setiap kali tombol diklik agar lebih rapi
  console.clear(); 
  console.log("Tombol 'Add to Cart' diklik. Menganalisis elemen tombol...");
  
  // 1. Kita tampilkan seluruh elemen HTML tombolnya ke console
  console.log("Elemen Tombol yang Diklik:", button);
  
  // 2. Kita coba baca semua dataset dari tombol tersebut
  const productId = button.dataset.productId;
  const productName = button.dataset.productName;
  const productPrice = button.dataset.productPrice;
  const productImage = button.dataset.productImage;
  
  console.log("--- Data yang berhasil dibaca dari dataset ---");
  console.log("ID:", productId);
  console.log("Name:", productName); // <-- KITA LIHAT APA NILAI INI
  console.log("Price:", productPrice);
  console.log("Image URL:", productImage); // <-- DAN APA NILAI INI
  console.log("-----------------------------------------");

  // Jika nama atau gambar tidak ada, kita hentikan dan beri tahu
  if (!productName || !productImage) {
      alert("DEBUG: Nama atau Gambar produk tidak ditemukan di atribut data-* tombol! Periksa fungsi displayProducts.");
      return; 
  }
  
  // 3. Kita buat objek 'item' dari data yang kita baca
  const item = {
      id: productId,
      name: productName,
      price: parseFloat(productPrice),
      image_url: productImage
  };
  
  console.log("Objek 'item' yang akan ditambahkan ke keranjang:", item);
  
  // 4. Kita lanjutkan proses seperti biasa
  if (window.cart) {
    window.cart.addItem(item);
  } else {
    console.error("ERROR: window.cart tidak ditemukan!");
  }
}

// Auth Function
function checkAuthStatus() {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const publicPages = ["login.html", "register.html"];

  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  const isAdminPage = window.location.pathname.includes("/admin/");

  if (!authToken) {
    console.log("Status: Logged Out.");
    if (!publicPages.includes(currentPage)) {
      console.log(
        `Page '${currentPage}' is PROTECTED. Redirecting to login...`
      );
      window.location.href = "/public/login.html";
    } else {
      console.log(`Page '${currentPage}' is PUBLIC. Access allowed.`);
    }
  } else {
    console.log("Status: Logged In.", "Role:", userRole);
    if (isAdminPage) {
      if (userRole !== "admin") {
        console.log(
          "Access to admin page DENIED (not an admin). Redirecting to home..."
        );
        alert("Anda tidak memiliki hak akses untuk halaman ini.");
        window.location.href = "/public/index.html";
      }
    } else if (publicPages.includes(currentPage)) {
      console.log("Already logged in. Redirecting to home page...");
      window.location.href = "/public/index.html";
    }
  }
}

// navbar
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector("nav");
  const logo = document.getElementById("logo");
  const navLinksContainer = document.getElementById("navLinksContainer");

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

/**
 * Menginisialisasi semua elemen UI yang bergantung pada status otentikasi.
 * Menggabungkan logika dropdown desktop, menu mobile, dan tombol logout.
 */
function initAuthUI() {
  // --- 1. Ambil semua informasi & elemen yang relevan ---
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // Elemen Desktop
  const profileButtonDesktop = document.getElementById("profile-button");
  const profileDropdownDesktop = document.getElementById("profile-dropdown");

  // Elemen Mobile
  const mobileUserMenu = document.getElementById("mobile-user-menu");
  const mobileGuestMenu = document.getElementById("mobile-guest-menu");

  // Elemen Admin (bisa lebih dari satu)
  const adminPanelLinks = document.querySelectorAll(".admin-panel-link");

  // Elemen Logout (bisa lebih dari satu)
  const logoutButtons = document.querySelectorAll(".logout-button");

  // --- 2. Atur Tampilan berdasarkan Status Login ---
  if (authToken) {
    // Pengguna SUDAH LOGIN
    if (profileButtonDesktop) profileButtonDesktop.classList.remove("hidden");
    if (mobileUserMenu) mobileUserMenu.classList.remove("hidden");
    if (mobileGuestMenu) mobileGuestMenu.classList.add("hidden");

    // Tampilkan link admin jika rolenya 'admin'
    if (userRole === "admin") {
      adminPanelLinks.forEach((link) => link.classList.remove("hidden"));
    }
  } else {
    // Pengguna BELUM LOGIN
    if (profileButtonDesktop) profileButtonDesktop.classList.add("hidden");
    if (mobileUserMenu) mobileUserMenu.classList.add("hidden");
    if (mobileGuestMenu) mobileGuestMenu.classList.remove("hidden");
  }

  // --- 3. Logika untuk Dropdown Desktop (dari kode Anda) ---
  if (profileButtonDesktop && profileDropdownDesktop) {
    let isDropdownOpen = false;
    const toggleDropdown = () => {
      isDropdownOpen = !isDropdownOpen;
      if (isDropdownOpen) {
        profileDropdownDesktop.classList.remove("hidden");
        requestAnimationFrame(() => {
          profileDropdownDesktop.classList.remove("opacity-0", "scale-95");
          profileDropdownDesktop.classList.add("opacity-100", "scale-100");
        });
      } else {
        profileDropdownDesktop.classList.remove("opacity-100", "scale-100");
        profileDropdownDesktop.classList.add("opacity-0", "scale-95");
        setTimeout(() => profileDropdownDesktop.classList.add("hidden"), 200);
      }
    };

    profileButtonDesktop.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDropdown();
    });

    window.addEventListener("click", () => {
      if (isDropdownOpen) {
        toggleDropdown();
      }
    });
  }

  // --- 4. Logika untuk SEMUA Tombol Logout (versi perbaikan) ---
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole"); // Hapus juga role saat logout
      alert("Anda telah berhasil logout.");
      window.location.href = "login.html"; // Sesuaikan path jika perlu
    });
  });
}

function adjustUIVisibilityBasedOnRole() {
  const userRole = localStorage.getItem("userRole");
  const adminPanelLinks = document.querySelectorAll(".admin-panel-link");

  console.log("Checking role for UI adjustment. Role:", userRole);

  if (userRole === "admin") {
    adminPanelLinks.forEach((link) => {
      link.classList.remove("hidden");
    });
    console.log("Admin detected, showing Admin Panel links.");
  } else {
    adminPanelLinks.forEach((link) => {
      link.classList.add("hidden");
    });
  }
}

// FAQ Accordion Animation
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

// Products
async function displayProducts() {
  // Ganti 'cardContainer' jika ID wadah utama Anda berbeda
  const productContainer = document.getElementById("cardContainer");
  if (!productContainer) {
    console.log(
      "Product container with id 'cardContainer' not found on this page."
    );
    return;
  }

  try {
    productContainer.innerHTML =
      '<p class="text-center text-gray-400 col-span-full">Loading products...</p>';

    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();

    productContainer.innerHTML = "";

    if (products.length === 0) {
      productContainer.innerHTML =
        '<p class="text-center text-gray-400 col-span-full">No products available at the moment.</p>';
      return;
    }

    products.forEach((product) => {
      // 1. Buat div pembungkus luar ('card')
      const productCardWrapper = document.createElement("div");
      productCardWrapper.className =
        "card transform hover:scale-105 transition-all duration-300";

      // 2. Buat HTML untuk isi kartu di dalamnya
      //    Ini sama persis dengan struktur yang Anda berikan.
      const cardInnerHTML = `
  <div class="bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-lg">
    <div class="relative">
      <img 
        src="/public/images/${product.image_url || "images/placeholder.jpg"}"
        alt="${product.name}" 
        class="w-full h-64 object-cover"
      >
      <div class="absolute top-4 right-4">
        <button class="love-button p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
          <svg class="heart-icon w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h6 class="text-xl font-semibold text-white">${product.name}</h6>
        <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg">$${parseFloat(
          product.price
        ).toFixed(2)}</span>
      </div>
      <p class="text-gray-300 text-sm mb-6 line-clamp-2">
        ${product.description}
      </p>
      <div class="flex flex-row-reverse justify-between items-center">
        <button 
          onclick="addItemToCart(this)" 
          class="add-to-cart-btn flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300"
          
          data-product-id="${product.id}"
          data-product-name="${product.name}"
          data-product-price="${product.price}"
          data-product-image="${product.image_url}"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>Add to Cart</span>
        </button>
        </div>
    </div>
  </div>
`;

      // 3. Masukkan HTML isi kartu ke dalam div pembungkus luar
      productCardWrapper.innerHTML = cardInnerHTML;

      // 4. Masukkan seluruh kartu yang sudah jadi ke dalam wadah utama
      productContainer.appendChild(productCardWrapper);
    });
  } catch (error) {
    console.error("Failed to load products:", error);
    productContainer.innerHTML =
      '<p class="text-center text-red-500 col-span-full">Failed to load products. Please try again later.</p>';
  }
}

// EmailJs
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;

  emailjs.init({ publicKey: "NYZE6VMcHdNBG8Nkz" });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitButton.innerHTML = "Sending...";
    submitButton.disabled = true;

    const serviceID = "service_k9z65yp";
    const templateID = "template_n2u8isc";

    emailjs
      .sendForm(serviceID, templateID, this)
      .then(
        () => {
          alert("Pesan Anda telah berhasil dikirim!");
          contactForm.reset();
        },
        (err) => {
          alert(
            "Gagal mengirim pesan. Silakan coba lagi.\n" + JSON.stringify(err)
          );
        }
      )
      .finally(() => {
        setTimeout(() => {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }, 2000);
      });
  });
}

// Map
function initLeafletMap() {
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
}

// Email Subscription
function setupSubscriptionForm() {
  const subscribeForm = document.getElementById("subscribe-form");

  if (!subscribeForm) {
    return;
  }

  const emailInput = document.getElementById("email-subscribe");
  const messageDiv = document.getElementById("subscribe-message");
  const submitButton = subscribeForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerText;

  subscribeForm.addEventListener("submit", function (event) {
    console.log(
      "Checkpoint 4: Tombol subscribe diklik! Mencegah submit tradisional..."
    );
    event.preventDefault();

    const email = emailInput.value;
    const mailchimpUrl =
      "https://gmail.us1.list-manage.com/subscribe/post?u=c5e3d99ba6b868f474e78ba43&id=cfe1309cbc&f_id=00a927e1f0".replace(
        "/post?",
        "/post-json?"
      );

    if (!email || !email.includes("@")) {
      messageDiv.innerText = "Please enter a valid email address.";
      messageDiv.style.color = "red";
      return;
    }

    const url = `${mailchimpUrl}&${emailInput.name}=${encodeURIComponent(
      email
    )}`;

    console.log("Checkpoint 5: Mengirim data ke URL:", url);

    submitButton.innerText = "Subscribing...";
    submitButton.disabled = true;

    jsonp(url, { param: "c" }, (err, data) => {
      submitButton.innerText = originalButtonText;
      submitButton.disabled = false;

      if (err) {
        messageDiv.innerText = "An error occurred. Please try again.";
        messageDiv.style.color = "red";
        console.error("Error dari JSONP:", err);
      } else if (data.result === "success") {
        messageDiv.innerText = data.msg;
        messageDiv.style.color = "green";
        subscribeForm.reset();
      } else {
        let cleanMsg = data.msg.replace(/^\d+ - /, "");
        messageDiv.innerText = cleanMsg;
        messageDiv.style.color = "red";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", setupSubscriptionForm);

function jsonp(url, options, callback) {
  const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
  const script = document.createElement("script");

  window[callbackName] = function (data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(null, data);
  };

  const param = options.param || "callback";
  script.src = `${url}&${param}=${callbackName}`;
  script.onerror = () => callback(new Error("JSONP request failed"));
  document.body.appendChild(script);
}

// Love Animation
/**
 * Mengatur tombol "love" menggunakan Event Delegation
 * agar berfungsi untuk kartu produk yang dimuat secara dinamis.
 */
function initLoveButtons() {
  const productContainer = document.getElementById("cardContainer");
  // Jika wadah produk tidak ada di halaman ini, hentikan fungsi.
  if (!productContainer) return;

  // Pasang SATU event listener di wadah utama.
  productContainer.addEventListener("click", function (event) {
    // Cek apakah elemen yang diklik (atau induknya) adalah sebuah .love-button
    const loveButton = event.target.closest(".love-button");

    // Jika yang di-klik bukan love-button, abaikan dan hentikan fungsi.
    if (!loveButton) return;

    // Jika yang di-klik adalah love-button, jalankan logika Anda
    console.log("Love button clicked!");
    const heartIcon = loveButton.querySelector(".heart-icon");

    heartIcon.classList.toggle("fill-pink-500");
    heartIcon.classList.toggle("text-pink-500");

    loveButton.classList.add("scale-125");
    setTimeout(() => {
      loveButton.classList.remove("scale-125");
    }, 150);
  });
}
