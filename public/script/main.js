// =====================================================================
// ==                 FILE main.js VERSI BERSIH                       ==
// =====================================================================

// // --- VARIABEL GLOBAL ---
const API_BASE_URL = "http://localhost:3000";

// --- FUNGSI UTAMA (dijalankan saat halaman dimuat) ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("Halaman selesai dimuat. Menjalankan fungsi setup terpusat...");

  // 1. Panggil fungsi otentikasi (wajib di setiap halaman)
  checkAuthStatus();
  setupAuthenticationAndNavbar();
  initProfieDropwdonUI();

  // 2. Panggil fungsi lain yang spesifik untuk halaman tertentu (dengan pengecekan)
  initNavbarScroll();
  // initMobileMenuToggle();
  initFAQAccordion();
  initLoveButtons(); // Aman karena sudah ada pengecekan di dalamnya
  setupSubscriptionForm(); // Aman karena sudah ada pengecekan di dalamnya

  // Fungsi ini hanya akan berjalan jika elemennya ada di halaman saat ini
  if (document.getElementById("cardContainer")) {
    displayProducts();
  }

  // Fungsi ini hanya akan berjalan di halaman user-panel
  if (window.location.pathname.includes("user-panel.html")) {
    loadUserOrders();
  }

  // Fungsi ini hanya akan berjalan di halaman kontak
  if (document.getElementById("contact-form")) {
    initContactForm();
  }

  // Fungsi ini hanya akan berjalan di halaman kontak
  if (document.getElementById("mapid")) {
    initLeafletMap();
  }

  // Event listener untuk modal produk (aman karena elemen modal ada di banyak halaman)
  setupProductModalListeners();
});

// --- KUMPULAN FUNGSI OTENTIKASI ---

function checkAuthStatus() {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const publicPagesForGuest = ["login.html", "register.html", "index.html"];

  let currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "" || currentPage === "public") {
    currentPage = "index.html";
  }

  const isAdminPage = window.location.pathname.includes("/admin/");

  if (!authToken || authToken === "null") {
    if (!publicPagesForGuest.includes(currentPage) && !isAdminPage) {
      alert("Anda harus login untuk mengakses halaman ini.");
      window.location.href = "login.html";
    }
  } else {
    if (isAdminPage && userRole !== "admin") {
      alert("Anda tidak memiliki hak akses untuk halaman ini.");
      window.location.href = "index.html";
    }
    if (currentPage === "login.html" || currentPage === "register.html") {
      window.location.href = "index.html";
    }
  }
}

// function updateNavbarUI() {
//     // Ambil elemen navbar utama
//     const navbar = document.getElementById('navbar');
//     if (!navbar) return;

//     // Ambil status otentikasi
//     const authToken = localStorage.getItem('authToken');
//     const userRole = localStorage.getItem('userRole');

//     // Ambil semua elemen lain di dalam navbar
//     const mainNavLinks = document.getElementById('nav-links-main');
//     const profileButtonContainer = document.getElementById('profile-button-container');
//     const desktopLoginButtonContainer = document.getElementById('desktop-login-button-container');
//     const adminPanelLinks = document.querySelectorAll('.admin-panel-link');
//     const mobileMenuButton = document.getElementById('mobile-menu-button');
//     const mobileLoginButtonContainer = document.getElementById('mobile-login-button-container');
//     const userPanelLinks = document.querySelectorAll('.user-panel-link');

//     // Pastikan navbar selalu terlihat
//     navbar.classList.remove('hidden');

//     if (authToken && authToken !== 'null') {
//         // --- KONDISI PENGGUNA SUDAH LOGIN ---

//         // Tampilkan menu navigasi di desktop dengan mengaktifkan 'md:flex'
//         if (mainNavLinks) mainNavLinks.classList.add('md:flex');

//         // Tampilkan/sembunyikan tombol yang relevan
//         if (profileButtonContainer) profileButtonContainer.classList.remove('hidden');
//         if (desktopLoginButtonContainer) desktopLoginButtonContainer.classList.add('hidden');
//         if (mobileMenuButton) mobileMenuButton.classList.remove('hidden');
//         if (mobileLoginButtonContainer) mobileLoginButtonContainer.classList.add('hidden');

//         // Logika untuk role admin/user
//         if (userRole === 'admin') {
//             adminPanelLinks.forEach(link => link.classList.remove('hidden'));
//             userPanelLinks.forEach(link => link.style.display = 'none');
//         } else {
//             adminPanelLinks.forEach(link => link.classList.add('hidden'));
//             userPanelLinks.forEach(link => link.style.display = 'block');
//         }

//     } else {
//         // --- KONDISI PENGGUNA ADALAH GUEST ---

//         // Sembunyikan menu navigasi di desktop dengan menonaktifkan 'md:flex'
//         if (mainNavLinks) mainNavLinks.classList.remove('md:flex');

//         // Tampilkan/sembunyikan tombol yang relevan
//         if (profileButtonContainer) profileButtonContainer.classList.add('hidden');
//         if (desktopLoginButtonContainer) desktopLoginButtonContainer.classList.remove('hidden');
//         if (mobileMenuButton) mobileMenuButton.classList.add('hidden');
//         if (mobileLoginButtonContainer) mobileLoginButtonContainer.classList.remove('hidden');

//         // Sembunyikan link khusus
//         adminPanelLinks.forEach(link => link.classList.add('hidden'));
//         userPanelLinks.forEach(link => link.style.display = 'none');
//     }
// }

function setupAuthenticationAndNavbar() {
  // --- 1. AMBIL DATA & ELEMEN ---
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // Elemen Navbar
  const navbar = document.getElementById("navbar");
  const mainNavLinks = document.getElementById("nav-links-main");
  const profileButtonContainer = document.getElementById(
    "profile-button-container"
  );
  const desktopLoginButtonContainer = document.getElementById(
    "desktop-login-button-container"
  );

  // Elemen Mobile
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileLoginButtonContainer =
    document.getElementById("mobile-guest-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  // === DUA VARIABEL YANG HILANG SEBELUMNYA ADA DI SINI ===
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  // =======================================================

  // Elemen Link Khusus
  const adminPanelLinks = document.querySelectorAll(".admin-panel-link");
  const userPanelLinks = document.querySelectorAll(".user-panel-link");

  // --- 2. LOGIKA PENGECEKAN HALAMAN (REDIRECT) ---
  const publicPages = ["login.html", "register.html", "index.html"];
  let currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "" || currentPage === "public") {
    currentPage = "index.html";
  }
  const isAdminPage = window.location.pathname.includes("/admin/");

  if (!authToken || authToken === "null") {
    if (!publicPages.includes(currentPage) && !isAdminPage) {
      alert("Anda harus login untuk mengakses halaman ini.");
      window.location.href = "/public/login.html";
      return;
    }
  } else {
    if (isAdminPage && userRole !== "admin") {
      alert("Anda tidak memiliki hak akses untuk halaman ini.");
      window.location.href = "/public/index.html";
      return;
    }
    if (currentPage === "login.html" || currentPage === "register.html") {
      window.location.href = "/public/index.html";
      return;
    }
  }

  // --- 3. LOGIKA PEMBARUAN TAMPILAN (UI) NAVBAR ---
  if (mainNavLinks) {
    if (!authToken && currentPage === "index.html") {
      mainNavLinks.classList.remove("md:flex");
    } else {
      mainNavLinks.classList.add("md:flex");
    }
  }

  if (authToken && authToken !== "null") {
    // TAMPILAN UNTUK USER LOGIN
    if (profileButtonContainer)
      profileButtonContainer.classList.remove("hidden");
    if (desktopLoginButtonContainer)
      desktopLoginButtonContainer.classList.add("hidden");
    if (mobileMenuButton) mobileMenuButton.classList.remove("hidden");
    if (mobileLoginButtonContainer)
      mobileLoginButtonContainer.classList.add("hidden");

    if (userRole === "admin") {
      adminPanelLinks.forEach((link) => link.classList.remove("hidden"));
      userPanelLinks.forEach((link) => (link.style.display = "none"));
    } else {
      adminPanelLinks.forEach((link) => link.classList.add("hidden"));
      userPanelLinks.forEach((link) => (link.style.display = "block"));
    }
  } else {
    // TAMPILAN UNTUK GUEST
    if (profileButtonContainer) profileButtonContainer.classList.add("hidden");
    if (desktopLoginButtonContainer)
      desktopLoginButtonContainer.classList.remove("hidden");
    if (mobileMenuButton) mobileMenuButton.classList.add("hidden");
    if (mobileLoginButtonContainer)
      mobileLoginButtonContainer.classList.remove("hidden");
    adminPanelLinks.forEach((link) => link.classList.add("hidden"));
    userPanelLinks.forEach((link) => (link.style.display = "none"));
  }

  // --- 4. LOGIKA EVENT LISTENER (TOMBOL KLIK) ---
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("opacity-100");
      if (isOpen) {
        mobileMenu.classList.remove('opacity-100', "h-max");
        mobileMenu.classList.add('opacity-0', "h-0");
        if (hamburgerIcon) hamburgerIcon.classList.remove("hidden");
        if (closeIcon) closeIcon.classList.add("hidden");
      } else {
        mobileMenu.classList.remove("opacity-0", "h-0");
        mobileMenu.classList.add("opacity-100", "h-max");
        if (hamburgerIcon) hamburgerIcon.classList.add("hidden");
        if (closeIcon) closeIcon.classList.remove("hidden");
      }
    });
  }

  const logoutButtons = document.querySelectorAll(".logout-button");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      alert("Anda telah berhasil logout.");
      window.location.href = "/public/login.html";
    });
  });
}

function initProfieDropwdonUI() {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  const profileButtonDesktop = document.getElementById("profile-button");
  const profileDropdownDesktop = document.getElementById("profile-dropdown");

  const mobileUserMenu = document.getElementById("mobile-user-menu");
  const mobileGuestMenu = document.getElementById("mobile-guest-menu");

  const adminPanelLinks = document.querySelectorAll(".admin-panel-link");
  const logoutButtons = document.querySelectorAll(".logout-button");

  if (authToken) {
    if (profileButtonDesktop) profileButtonDesktop.classList.remove("hidden");
    if (mobileUserMenu) mobileUserMenu.classList.remove("hidden");
    if (mobileGuestMenu) mobileGuestMenu.classList.add("hidden");

    if (userRole === "admin") {
      adminPanelLinks.forEach((link) => link.classList.remove("hidden"));
    }
  } else {
    if (profileButtonDesktop) profileButtonDesktop.classList.add("hidden");
    if (mobileUserMenu) mobileUserMenu.classList.add("hidden");
    if (mobileGuestMenu) mobileGuestMenu.classList.remove("hidden");
  }

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

  logoutButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      alert("Anda telah berhasil logout.");
      window.location.href = "login.html";
    });
  });
}

// --- KUMPULAN FUNGSI LAINNYA ---

function initNavbarScroll() {
  const navbar = document.querySelector("nav");
  if (!navbar) return;

  const handleScroll = () => {
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
  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

// function initMobileMenuToggle() {
//     const mobileMenuButton = document.getElementById('mobile-menu-button');
//     const mobileMenu = document.getElementById('mobile-menu');
//     const hamburgerIcon = document.getElementById('hamburger-icon');
//     const closeIcon = document.getElementById('close-icon');

//     if (mobileMenuButton && mobileMenu) {
//       mobileMenuButton.addEventListener('click', () => {
//         const isOpen = mobileMenu.classList.contains('opacity-100');
//         if (isOpen) {
//           mobileMenu.classList.remove('opacity-100', 'max-h-screen');
//           mobileMenu.classList.add('opacity-0', 'max-h-0');
//           if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
//           if (closeIcon) closeIcon.classList.add('hidden');
//         } else {
//           mobileMenu.classList.remove('opacity-0', 'max-h-0');
//           mobileMenu.classList.add('opacity-100', 'max-h-screen');
//           if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
//           if (closeIcon) closeIcon.classList.remove('hidden');
//         }
//       });
//     }
// }

// =====================================================================
// ==      SALIN DAN TEMPEL SEMUA FUNGSI DI BAWAH INI KE main.js       ==
// =====================================================================

// --- FUNGSI TERKAIT PRODUK ---

async function displayProducts() {
  const productContainer = document.getElementById("cardContainer");
  if (!productContainer) {
    // Pesan ini normal jika kita tidak di halaman market
    console.log(
      "Product container with id 'cardContainer' not found on this page."
    );
    return;
  }

  try {
    productContainer.innerHTML =
      '<p class="text-center text-gray-400 col-span-full">Loading products...</p>';
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    productContainer.innerHTML = "";

    if (products.length === 0) {
      productContainer.innerHTML =
        '<p class="text-center text-gray-400 col-span-full">No products available.</p>';
      return;
    }

    products.forEach((product) => {
      const productCardWrapper = document.createElement("div");
      productCardWrapper.className =
        "card transform hover:scale-105 transition-all duration-300";
      const cardInnerHTML = `
        <div class="bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-lg">
          <div class="relative">
            <img 
              src="/public/images/${product.image_url || "placeholder.jpg"}"
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
            <p class="text-gray-300 text-sm mb-6 line-clamp-2">${
              product.description
            }</p>
            <div class="flex flex-row-reverse justify-start gap-2 items-center">
              <button 
                onclick="addItemToCart(this)" 
                class="add-to-cart-btn flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300"
                data-product-id="${product.id}"
                data-product-name="${product.name}"
                data-product-price="${product.price}"
                data-product-image="${product.image_url}"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span>Add to Cart</span>
              </button>
              <button 
                onclick="showProductDetail(event, this)"
                class="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300"
                data-product='${JSON.stringify(product)}'
              >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  <span>Detail</span>
              </button>
            </div>
          </div>
        </div>
      `;
      productCardWrapper.innerHTML = cardInnerHTML;
      productContainer.appendChild(productCardWrapper);
    });
  } catch (error) {
    console.error("Failed to load products:", error);
    productContainer.innerHTML =
      '<p class="text-center text-red-500 col-span-full">Failed to load products.</p>';
  }
}

function showProductDetail(event, button) {
  event.stopPropagation();
  const product = JSON.parse(button.dataset.product);
  const modal = document.getElementById("productDetailModal");
  const modalContent = modal.querySelector("div.relative");
  const modalProductName = document.getElementById("modalProductName");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const modalProductDescription = document.getElementById(
    "modalProductDescription"
  );
  const imageSlider = document.getElementById("imageSlider");
  const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
  const modalCheckoutNowBtn = document.getElementById("modalCheckoutNowBtn");

  modalProductName.textContent = product.name;
  modalProductPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;
  modalProductDescription.textContent = product.description;
  imageSlider.innerHTML = `<img src="/public/images/${
    product.image_url || "placeholder.jpg"
  }" alt="${product.name}" class="w-full h-96 object-cover rounded-2xl">`;

  modalAddToCartBtn.dataset.productId = product.id;
  modalAddToCartBtn.dataset.productName = product.name;
  modalAddToCartBtn.dataset.productPrice = product.price;
  modalAddToCartBtn.dataset.productImage = product.image_url;

  const newCheckoutBtn = modalCheckoutNowBtn.cloneNode(true);
  modalCheckoutNowBtn.parentNode.replaceChild(
    newCheckoutBtn,
    modalCheckoutNowBtn
  );
  newCheckoutBtn.addEventListener("click", () => checkoutNow(product));

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  setTimeout(() => {
    modalContent.classList.remove("opacity-0", "scale-95");
    modalContent.classList.add("opacity-100", "scale-100");
  }, 10);
}

function closeProductDetailModal() {
  const modal = document.getElementById("productDetailModal");
  if (!modal) return;
  const modalContent = modal.querySelector("div.relative");
  modalContent.classList.remove("opacity-100", "scale-100");
  modalContent.classList.add("opacity-0", "scale-95");
  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 300);
}

function setupProductModalListeners() {
  const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
  const productDetailModal = document.getElementById("productDetailModal");

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", function () {
      addItemToCart(this);
      closeProductDetailModal();
    });
  }

  if (productDetailModal) {
    productDetailModal.addEventListener("click", function (event) {
      if (event.target === this) {
        closeProductDetailModal();
      }
    });
  }
}

// --- FUNGSI TERKAIT KERANJANG & CHECKOUT ---

function checkoutNow(productData) {
  const selectedSizeElement = document.querySelector(
    'input[name="size"]:checked'
  );
  if (!selectedSizeElement) {
    alert("Silakan pilih ukuran terlebih dahulu!");
    return;
  }
  const selectedSize = selectedSizeElement.value;

  const productToCheckout = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image_url: productData.image_url,
    size: selectedSize,
    quantity: 1,
  };

  localStorage.setItem("cartForCheckout", JSON.stringify([productToCheckout]));
  window.location.href = "checkout.html";
}

function addItemToCart(button) {
  const item = {
    id: button.dataset.productId,
    name: button.dataset.productName,
    price: parseFloat(button.dataset.productPrice),
    image_url: button.dataset.productImage,
  };
  if (window.cart) {
    window.cart.addItem(item);
  } else {
    console.error("ERROR: window.cart tidak ditemukan!");
  }
}

// --- FUNGSI TERKAIT USER PANEL ---

let allOrders = [];

async function loadUserOrders() {
  const ordersContainer = document.getElementById("orders-container");
  const loadingMessage = document.getElementById("loading-message");
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    alert("Anda harus login untuk melihat halaman ini.");
    window.location.href = "login.html";
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil data pesanan.");

    allOrders = await response.json();
    if (loadingMessage) loadingMessage.remove();

    updateOrderStats();
    renderOrders("all");
  } catch (error) {
    if (loadingMessage) loadingMessage.textContent = `Error: ${error.message}`;
  }
}

function updateOrderStats() {
  const totalOrdersEl = document.getElementById("total-orders");
  const deliveredOrdersEl = document.getElementById("delivered-orders");
  const processingOrdersEl = document.getElementById("processing-orders");
  if (!totalOrdersEl || !deliveredOrdersEl || !processingOrdersEl) return;

  totalOrdersEl.textContent = allOrders.length;
  deliveredOrdersEl.textContent = allOrders.filter(
    (o) => o.status.toLowerCase() === "shipped"
  ).length;
  processingOrdersEl.textContent = allOrders.filter(
    (o) => o.status.toLowerCase() === "pending"
  ).length;
}

function renderOrders(filter) {
  const ordersContainer = document.getElementById("orders-container");
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  let filteredOrders =
    filter === "all"
      ? allOrders
      : allOrders.filter((o) => o.status.toLowerCase() === filter);

  if (filteredOrders.length === 0) {
    ordersContainer.innerHTML = "<p>Tidak ada pesanan untuk filter ini.</p>";
    return;
  }
  filteredOrders.forEach((order) => {
    const orderCard = document.createElement("div");
    orderCard.className = "bg-[#181923] p-6 rounded-lg border border-gray-700";
    const orderDate = new Date(order.order_date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let itemsHtml = '<ul class="list-disc list-inside mt-2 text-gray-400">';
    order.items.forEach((item) => {
      itemsHtml += `<li>${item.quantity}x ${item.product_name}</li>`;
    });
    itemsHtml += "</ul>";
    orderCard.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-xl font-semibold">Order #${order.id}</h2>
                <span class="px-3 py-1 text-sm rounded-full ${getStatusColor(
                  order.status
                )}">${order.status}</span>
            </div>
            <p class="text-sm text-gray-400 mb-4">Date: ${orderDate}</p>
            <div><h3 class="font-semibold">Items:</h3>${itemsHtml}</div>
            <div class="border-t border-gray-600 mt-4 pt-4 text-right">
                <p class="text-lg font-bold">Total: $${new Intl.NumberFormat(
                  "en-US"
                ).format(order.total_price)}</p>
            </div>
        `;
    ordersContainer.appendChild(orderCard);
  });
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-400";
    case "shipped":
      return "bg-blue-500/20 text-blue-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

// --- FUNGSI LAIN-LAIN ---

function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  emailjs.init({ publicKey: "NYZE6VMcHdNBG8Nkz" });
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitButton.innerHTML = "Sending...";
    submitButton.disabled = true;
    emailjs
      .sendForm("service_k9z65yp", "template_n2u8isc", this)
      .then(
        () => {
          alert("Pesan Anda telah berhasil dikirim!");
          contactForm.reset();
        },
        (err) => {
          alert("Gagal mengirim pesan.\n" + JSON.stringify(err));
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

function initLeafletMap() {
  if (typeof L === "undefined") return;
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
    .bindPopup("<b>Apparels 16</b>")
    .openPopup();
}

function setupSubscriptionForm() {
  const subscribeForm = document.getElementById("subscribe-form");
  if (!subscribeForm) return;
  const emailInput = document.getElementById("email-subscribe");
  const messageDiv = document.getElementById("subscribe-message");
  const submitButton = subscribeForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerText;

  subscribeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value;
    const mailchimpUrl =
      "https://gmail.us1.list-manage.com/subscribe/post-json?u=c5e3d99ba6b868f474e78ba43&id=cfe1309cbc&f_id=00a927e1f0";
    if (!email || !email.includes("@")) {
      messageDiv.innerText = "Please enter a valid email address.";
      messageDiv.style.color = "red";
      return;
    }
    const url = `${mailchimpUrl}&${emailInput.name}=${encodeURIComponent(
      email
    )}`;
    submitButton.innerText = "Subscribing...";
    submitButton.disabled = true;
    jsonp(url, { param: "c" }, (err, data) => {
      submitButton.innerText = originalButtonText;
      submitButton.disabled = false;
      if (err) {
        messageDiv.innerText = "An error occurred. Please try again.";
        messageDiv.style.color = "red";
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

function initLoveButtons() {
  const productContainer = document.getElementById("cardContainer");
  if (!productContainer) return;
  productContainer.addEventListener("click", function (event) {
    const loveButton = event.target.closest(".love-button");
    if (!loveButton) return;
    const heartIcon = loveButton.querySelector(".heart-icon");
    heartIcon.classList.toggle("fill-pink-500");
    heartIcon.classList.toggle("text-pink-500");
    loveButton.classList.add("scale-125");
    setTimeout(() => {
      loveButton.classList.remove("scale-125");
    }, 150);
  });
}

function initFAQAccordion() {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    const content = header.nextElementSibling;
    const icon = header.querySelector("svg");
    if (!content) return;
    content.style.maxHeight = "0px";
    header.addEventListener("click", () => {
      const isOpen = content.style.maxHeight !== "0px";
      if (isOpen) {
        content.style.maxHeight = "0px";
        if (icon) icon.style.transform = "rotate(0deg)";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

function selectSize(clickedLabel) {
    // Daftar kelas Tailwind untuk status 'terpilih' dan 'default'
    const selectedClasses = ['border-blue-500', 'bg-blue-600/20', 'text-white'];
    const defaultClasses = ['border-gray-700', 'bg-gray-800', 'text-gray-300'];

    // 1. Dapatkan SEMUA label ukuran di dalam modal
    const allSizeLabels = document.querySelectorAll('#productDetailModal input[name="size"] + label');

    // 2. Reset tampilan SEMUA label ke kondisi default
    allSizeLabels.forEach(label => {
        label.classList.remove(...selectedClasses);
        label.classList.add(...defaultClasses);
    });

    // 3. Terapkan tampilan 'terpilih' HANYA ke label yang baru saja diklik
    clickedLabel.classList.add(...selectedClasses);
    clickedLabel.classList.remove(...defaultClasses);

    // 4. Atur input radio yang sesuai agar 'checked' di belakang layar
    const radioId = clickedLabel.getAttribute('for');
    const radioInput = document.getElementById(radioId);
    if (radioInput) {
        radioInput.checked = true;
    }
} 

// Auth User
// checkAuthStatus();

// // Define URL
// const API_BASE_URL = "http://localhost:3000";

// // init
// document.addEventListener("DOMContentLoaded", () => {
//   if (document.getElementById("contact-form")) {
//     initContactForm();
//   }

//   if (document.getElementById("mapid")) {
//     initLeafletMap();
//   }

//   if (window.location.pathname.includes("user-panel.html")) {
//     loadUserOrders();
//   }

//   updateNavbarUI();
//   checkAuthStatus();
//   displayProducts();
//   initLoveButtons();
//   initAuthUI();
// });

// // Auth Function
// function checkAuthStatus() {
//     const authToken = localStorage.getItem("authToken");
//     const userRole = localStorage.getItem("userRole");
//     const publicPagesForGuest = ["login.html", "register.html", "index.html"];

//     let currentPage = window.location.pathname.split("/").pop();
//     if (currentPage === "") {
//         currentPage = "index.html";
//     }

//     const isAdminPage = window.location.pathname.includes("/admin/");

//     // --- BLOK DEBUG UTAMA ---
//     console.log("AuthToken:", authToken);
//     console.log("CurrentPage:", currentPage);

//     if (!authToken || authToken === 'null') {
//         console.log("STATUS: Terdeteksi sebagai GUEST.");

//         // 'Mata-mata' untuk melihat hasil pengecekan .includes()
//         const isPageAllowed = publicPagesForGuest.includes(currentPage);
//         console.log(`Mengecek: Apakah halaman '${currentPage}' ada di dalam [${publicPagesForGuest}]? -> Hasil: ${isPageAllowed}`);

//         if (!isPageAllowed) {
//             console.log("AKSI: Akses ditolak! Mengarahkan ke login.html..."); // Jika Anda melihat ini, berarti ada masalah.
//             alert("Anda harus login untuk mengakses halaman ini.");
//             window.location.href = "login.html";
//         } else {
//             console.log("AKSI: Akses diizinkan untuk GUEST.");
//         }
//     } else {
//         console.log("STATUS: Terdeteksi sebagai USER LOGIN.");
//         // ... (sisa logika untuk user yang sudah login) ...
//         if (isAdminPage && userRole !== "admin") {
//             alert("Anda tidak memiliki hak akses untuk halaman ini.");
//             window.location.href = "index.html";
//         }
//         if (currentPage === "login.html" || currentPage === "register.html") {
//             window.location.href = "index.html";
//         }
//     }
// }
// // navbar
// document.addEventListener("DOMContentLoaded", function () {
//   const navbar = document.querySelector("nav");

//   const mobileMenu = document.getElementById("mobile-menu");
//   const mobileMenuButton = document.getElementById("mobile-menu-button");
//   const hamburgerIcon = document.getElementById("hamburger-icon");
//   const closeIcon = document.getElementById("close-icon");
//   const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

//   let isMobileMenuOpen = false;

//   const toggleMobileMenu = () => {
//     if (!mobileMenu || !hamburgerIcon || !closeIcon) return;
//     isMobileMenuOpen = !isMobileMenuOpen;

//     mobileMenu.classList.toggle("open", isMobileMenuOpen);

//     hamburgerIcon.classList.toggle("hidden", isMobileMenuOpen);
//     closeIcon.classList.toggle("hidden", !isMobileMenuOpen);
//   };

//   const handleScroll = () => {
//     if (!navbar) return;

//     const isScrolled = window.scrollY > 50;

//     if (isScrolled) {
//       navbar.classList.remove("from-black/50", "to-transparent");
//       navbar.classList.add("bg-gray-900/70", "backdrop-blur-md", "shadow-lg");
//     } else {
//       navbar.classList.remove(
//         "bg-gray-900/70",
//         "backdrop-blur-md",
//         "shadow-lg"
//       );
//       navbar.classList.add("from-black/50", "to-transparent");
//     }
//   };

//   if (mobileMenuButton) {
//     mobileMenuButton.addEventListener("click", toggleMobileMenu);
//   }

//   window.addEventListener("scroll", handleScroll);

//   mobileNavLinks.forEach((link) => {
//     link.addEventListener("click", () => {
//       if (isMobileMenuOpen) {
//         toggleMobileMenu();
//       }
//     });
//   });

//   handleScroll();
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const allLoveButtons = document.querySelectorAll(".love-button");

//   allLoveButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       const heartIcon = button.querySelector(".heart-icon");

//       heartIcon.classList.toggle("fill-pink-500");
//       heartIcon.classList.toggle("text-pink-500");

//       button.classList.add("scale-125");
//       setTimeout(() => {
//         button.classList.remove("scale-125");
//       }, 150);
//     });
//   });
// });

// function initAuthUI() {
//   const authToken = localStorage.getItem("authToken");
//   const userRole = localStorage.getItem("userRole");

//   const profileButtonDesktop = document.getElementById("profile-button");
//   const profileDropdownDesktop = document.getElementById("profile-dropdown");

//   const mobileUserMenu = document.getElementById("mobile-user-menu");
//   const mobileGuestMenu = document.getElementById("mobile-guest-menu");

//   const adminPanelLinks = document.querySelectorAll(".admin-panel-link");
//   const logoutButtons = document.querySelectorAll(".logout-button");

//   if (authToken) {
//     if (profileButtonDesktop) profileButtonDesktop.classList.remove("hidden");
//     if (mobileUserMenu) mobileUserMenu.classList.remove("hidden");
//     if (mobileGuestMenu) mobileGuestMenu.classList.add("hidden");

//     if (userRole === "admin") {
//       adminPanelLinks.forEach((link) => link.classList.remove("hidden"));
//     }
//   } else {
//     if (profileButtonDesktop) profileButtonDesktop.classList.add("hidden");
//     if (mobileUserMenu) mobileUserMenu.classList.add("hidden");
//     if (mobileGuestMenu) mobileGuestMenu.classList.remove("hidden");
//   }

//   if (profileButtonDesktop && profileDropdownDesktop) {
//     let isDropdownOpen = false;
//     const toggleDropdown = () => {
//       isDropdownOpen = !isDropdownOpen;
//       if (isDropdownOpen) {
//         profileDropdownDesktop.classList.remove("hidden");
//         requestAnimationFrame(() => {
//           profileDropdownDesktop.classList.remove("opacity-0", "scale-95");
//           profileDropdownDesktop.classList.add("opacity-100", "scale-100");
//         });
//       } else {
//         profileDropdownDesktop.classList.remove("opacity-100", "scale-100");
//         profileDropdownDesktop.classList.add("opacity-0", "scale-95");
//         setTimeout(() => profileDropdownDesktop.classList.add("hidden"), 200);
//       }
//     };

//     profileButtonDesktop.addEventListener("click", (event) => {
//       event.stopPropagation();
//       toggleDropdown();
//     });

//     window.addEventListener("click", () => {
//       if (isDropdownOpen) {
//         toggleDropdown();
//       }
//     });
//   }

//   logoutButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       event.preventDefault();
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("userRole");
//       alert("Anda telah berhasil logout.");
//       window.location.href = "login.html";
//     });
//   });
// }

// function updateNavbarUI() {
//     console.log("--- Menjalankan updateNavbarUI ---");

//     // 1. Ambil semua data dan elemen yang dibutuhkan
//     const authToken = localStorage.getItem('authToken');
//     const userRole = localStorage.getItem('userRole');

//     console.log("updateNavbarUI mendeteksi -> Token:", authToken, "| Role:", userRole);

//     // Selektor untuk Desktop
//     const mainNavLinks = document.getElementById('nav-links-main');
//     const profileButtonContainer = document.getElementById('profile-button-container');
//     const desktopLoginButtonContainer = document.getElementById('desktop-login-button-container');
//     const adminPanelLinks = document.querySelectorAll('.admin-panel-link');

//     // Selektor untuk Mobile
//     const mobileMenuButton = document.getElementById('mobile-menu-button');
//     const mobileLoginButtonContainer = document.getElementById('mobile-login-button-container');
//     const userPanelLinks = document.querySelectorAll('.user-panel-link');

//     // Mata-mata untuk elemen kunci
//     console.log("Elemen Tombol Login Desktop:", desktopLoginButtonContainer);
//     console.log("Elemen Kontainer Profil:", profileButtonContainer);

//     // Logika untuk menu desktop utama
//     if (mainNavLinks) {
//       if (!authToken && window.location.pathname.endsWith('index.html')) {
//         mainNavLinks.classList.add('hidden');
//       } else {
//         mainNavLinks.classList.add('md:flex');
//         mainNavLinks.classList.remove('hidden');
//       }
//     }

//     // 3. KONTROL TOMBOL-TOMBOL (LOGIN, PROFIL, HAMBURGER)
//     if (authToken && authToken !== 'null') {
//         console.log("STATUS UI: Menampilkan UI untuk PENGGUNA LOGIN.");
//         // --- KONDISI PENGGUNA SUDAH LOGIN ---
//         if (profileButtonContainer) profileButtonContainer.classList.remove('hidden');
//         if (desktopLoginButtonContainer) desktopLoginButtonContainer.classList.add('hidden');
//         if (mobileMenuButton) mobileMenuButton.classList.remove('hidden');
//         if (mobileLoginButtonContainer) mobileLoginButtonContainer.classList.add('hidden');

//         if (userRole === 'admin') {
//             adminPanelLinks.forEach(link => link.classList.remove('hidden'));
//             userPanelLinks.forEach(link => link.style.display = 'none');
//         } else {
//             adminPanelLinks.forEach(link => link.classList.add('hidden'));
//             userPanelLinks.forEach(link => link.style.display = 'block');
//         }

//     } else {
//         console.log("STATUS UI: Menampilkan UI untuk GUEST.");
//         // --- KONDISI PENGGUNA ADALAH TAMU ---
//         if (profileButtonContainer) profileButtonContainer.classList.add('hidden');
//         if (desktopLoginButtonContainer) desktopLoginButtonContainer.classList.remove('hidden');
//         if (mobileMenuButton) mobileMenuButton.classList.add('hidden');
//         if (mobileLoginButtonContainer) mobileLoginButtonContainer.classList.remove('hidden');
//         adminPanelLinks.forEach(link => link.classList.add('hidden'));
//         userPanelLinks.forEach(link => link.style.display = 'none');
//     }
// }

// // FAQ Accordion Animation
// document.addEventListener("DOMContentLoaded", () => {
//   const accordionHeaders = document.querySelectorAll(".accordion-header");

//   accordionHeaders.forEach((header) => {
//     const content = header.nextElementSibling;
//     const icon = header.querySelector("svg");

//     content.style.maxHeight = "0px";

//     header.addEventListener("click", () => {
//       const isOpen = content.style.maxHeight !== "0px";

//       if (isOpen) {
//         content.style.maxHeight = "0px";
//         icon.style.transform = "rotate(0deg)";
//       } else {
//         content.style.maxHeight = content.scrollHeight + "px";
//         icon.style.transform = "rotate(180deg)";
//       }
//     });
//   });
// });

// // Products
// async function displayProducts() {
//   const productContainer = document.getElementById("cardContainer");
//   if (!productContainer) {
//     console.log(
//       "Product container with id 'cardContainer' not found on this page."
//     );
//     return;
//   }

//   try {
//     productContainer.innerHTML =
//       '<p class="text-center text-gray-400 col-span-full">Loading products...</p>';

//     const response = await fetch(`${API_BASE_URL}/api/products`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const products = await response.json();

//     productContainer.innerHTML = "";

//     if (products.length === 0) {
//       productContainer.innerHTML =
//         '<p class="text-center text-gray-400 col-span-full">No products available at the moment.</p>';
//       return;
//     }

//     products.forEach((product) => {
//       const productCardWrapper = document.createElement("div");
//       productCardWrapper.className =
//         "card transform hover:scale-105 transition-all duration-300";

//       const cardInnerHTML = `
//   <div class="bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-lg">
//     <div class="relative">
//       <img
//         src="/public/images/${product.image_url || "images/placeholder.jpg"}"
//         alt="${product.name}"
//         class="w-full h-64 object-cover"
//       >
//       <div class="absolute top-4 right-4">
//         <button class="love-button p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
//           <svg class="heart-icon w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//     <div class="p-6">
//       <div class="flex justify-between items-center mb-4">
//         <h6 class="text-xl font-semibold text-white">${product.name}</h6>
//         <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg">$${parseFloat(
//           product.price
//         ).toFixed(2)}</span>
//       </div>
//       <p class="text-gray-300 text-sm mb-6 line-clamp-2">
//         ${product.description}
//       </p>
//       <div class="flex flex-row-reverse justify-start gap-2 items-center">
//         <button
//           onclick="addItemToCart(this)"
//           class="add-to-cart-btn flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300"
//           data-product-id="${product.id}"
//           data-product-name="${product.name}"
//           data-product-price="${product.price}"
//           data-product-image="${product.image_url}"
//         >
//           <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
//           </svg>
//           <span>Add to Cart</span>
//         </button>

//         <button
//           onclick="showProductDetail(event, this)"
//           class="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-all duration-300"
//           data-product='${JSON.stringify(product)}'
//         >
//             <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//             </svg>
//             <span>Detail</span>
//         </button>
//       </div>
//     </div>
//   </div>
// `;

//       productCardWrapper.innerHTML = cardInnerHTML;

//       productContainer.appendChild(productCardWrapper);
//     });
//   } catch (error) {
//     console.error("Failed to load products:", error);
//     productContainer.innerHTML =
//       '<p class="text-center text-red-500 col-span-full">Failed to load products. Please try again later.</p>';
//   }
// }

// // Function to show product detail modal
// // Fungsi untuk menampilkan modal detail produk
// function showProductDetail(event, button) {
//     event.stopPropagation();

//     const product = JSON.parse(button.dataset.product);
//     const modal = document.getElementById("productDetailModal");
//     const modalContent = modal.querySelector('div.relative'); // Ambil elemen konten modal

//     const modalProductName = document.getElementById("modalProductName");
//     const modalProductPrice = document.getElementById("modalProductPrice");
//     const modalProductDescription = document.getElementById("modalProductDescription");
//     const imageSlider = document.getElementById("imageSlider");
//     const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

//     // Isi modal dengan data produk
//     modalProductName.textContent = product.name;
//     modalProductPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;
//     modalProductDescription.textContent = product.description;

//     // Hapus gambar sebelumnya dan tambahkan gambar baru
//     imageSlider.innerHTML = `
//         <img
//           src="/public/images/${product.image_url || "images/placeholder.jpg"}"
//           alt="${product.name}"
//           class="w-full h-96 object-cover rounded-2xl"
//         >
//     `;

//     // Perbarui atribut data tombol "Add to Cart" di modal
//     modalAddToCartBtn.dataset.productId = product.id;
//     modalAddToCartBtn.dataset.productName = product.name;
//     modalAddToCartBtn.dataset.productPrice = product.price;
//     modalAddToCartBtn.dataset.productImage = product.image_url;

//     // Tampilkan modal dengan transisi
//     modal.classList.remove("hidden");
//     modal.classList.add("flex"); // Tambahkan kelas 'flex' untuk menampilkan backdrop

//     // Tunggu sebentar agar browser merender perubahan, lalu mulai transisi
//     // Ini penting agar transisi dari opacity-0 ke opacity-100 bisa berjalan
//     setTimeout(() => {
//         modalContent.classList.remove('opacity-0', 'scale-95');
//         modalContent.classList.add('opacity-100', 'scale-100');
//     }, 10);
// }

// // Fungsi untuk menutup modal detail produk
// function closeProductDetailModal() {
//     const modal = document.getElementById("productDetailModal");
//     const modalContent = modal.querySelector('div.relative');

//     // Mulai transisi untuk menyembunyikan
//     modalContent.classList.remove('opacity-100', 'scale-100');
//     modalContent.classList.add('opacity-0', 'scale-95');

//     // Tunggu transisi selesai (300ms) sebelum menyembunyikan modal sepenuhnya
//     setTimeout(() => {
//         modal.classList.remove("flex");
//         modal.classList.add("hidden");
//     }, 300); // Sesuaikan dengan durasi transisi di CSS (duration-300)
// }

// // function checkout 1 barang
// function checkoutNow() {
//     console.log("Fungsi checkoutNow() dipanggil...");

//     // 1. Ambil data produk dasar dari atribut data tombol "Add to Cart"
//     //    (Ini adalah cara yang efisien karena data sudah disimpan di sana oleh fungsi showProductDetail)
//     const addToCartBtn = document.getElementById('modalAddToCartBtn');
//     const productId = addToCartBtn.dataset.productId;
//     const productName = addToCartBtn.dataset.productName;
//     const productPrice = addToCartBtn.dataset.productPrice;

//     // 2. Validasi pilihan ukuran (karena ada radio button untuk ukuran)
//     const selectedSizeElement = document.querySelector('input[name="size"]:checked');

//     if (!selectedSizeElement) {
//         // Jika tidak ada ukuran yang dipilih, beri peringatan dan hentikan fungsi
//         alert('Silakan pilih ukuran terlebih dahulu!');
//         return; // Menghentikan eksekusi fungsi
//     }

//     const selectedSize = selectedSizeElement.value;

//     // 3. Siapkan objek data produk untuk di-checkout
//     const productToCheckout = {
//         id: productId,
//         name: productName,
//         price: productPrice,
//         size: selectedSize,
//         quantity: 1 // Checkout langsung diasumsikan 1 barang
//     };

//     // 4. Tampilkan data di console untuk debugging
//     console.log("Data produk yang akan di-checkout:", productToCheckout);

//     // 5. Buat URL untuk halaman checkout dengan data produk sebagai parameter
//     //    Ini adalah cara umum untuk mengirim data ke halaman berikutnya.
//     const queryParams = new URLSearchParams(productToCheckout).toString();
//     const checkoutUrl = `checkout.html?${queryParams}`; // Ganti '/halaman-checkout.html' dengan URL halaman checkout Anda

//     // 6. Arahkan pengguna ke halaman checkout
//     window.location.href = checkoutUrl;
// }

// // --- Logika untuk Modal Detail Produk ---

// // 1. Ambil semua elemen yang berhubungan dengan modal
// const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
// const productDetailModal = document.getElementById("productDetailModal");

// // 2. Pasang event listener untuk tombol 'Add to Cart' di dalam modal, HANYA JIKA tombolnya ada
// if (modalAddToCartBtn) {
//     modalAddToCartBtn.addEventListener('click', function() {
//         addItemToCart(this);
//         closeProductDetailModal();
//     });
// }

// // 3. Pasang event listener untuk menutup modal, HANYA JIKA modalnya ada
// if (productDetailModal) {
//     productDetailModal.addEventListener("click", function(event) {
//         // Pastikan event.target adalah modal itu sendiri, bukan elemen di dalamnya
//         if (event.target === this) {
//             closeProductDetailModal();
//         }
//     });
// }

// // Event listener untuk tombol "Add to Cart" di dalam modal
// // document.getElementById("modalAddToCartBtn").addEventListener('click', function() {
// //     addItemToCart(this);
// //     closeProductDetailModal();
// // });

// // // Tutup modal saat mengklik area di luar kontennya
// // document.getElementById("productDetailModal").addEventListener("click", function(event) {
// //     // Pastikan event.target adalah modal itu sendiri, bukan elemen di dalamnya
// //     if (event.target === this) {
// //         closeProductDetailModal();
// //     }
// // });

// /**
//  * @param {HTMLElement} button -
//  */
// function addItemToCart(button) {
//   const productId = button.dataset.productId;
//   const productName = button.dataset.productName;
//   const productPrice = button.dataset.productPrice;
//   const productImage = button.dataset.productImage;

//   if (!productName || !productImage) {
//     alert(
//       "DEBUG: Nama atau Gambar produk tidak ditemukan di atribut data-* tombol! Periksa fungsi displayProducts."
//     );
//     return;
//   }

//   const item = {
//     id: productId,
//     name: productName,
//     price: parseFloat(productPrice),
//     image_url: productImage,
//   };

//   console.log("Objek 'item' yang akan ditambahkan ke keranjang:", item);

//   if (window.cart) {
//     window.cart.addItem(item);
//   } else {
//     console.error("ERROR: window.cart tidak ditemukan!");
//   }
// }

// //User panel
// let allOrders = [];

// // Load data orders user
// async function loadUserOrders() {
//   const ordersContainer = document.getElementById("orders-container");
//   const loadingMessage = document.getElementById("loading-message");
//   const authToken = localStorage.getItem("authToken");

//   if (!authToken) {
//     alert("Anda harus login untuk melihat halaman ini.");
//     window.location.href = "login.html";
//     return;
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//     });

//     if (!response.ok) throw new Error("Gagal mengambil data pesanan.");

//     allOrders = await response.json(); // simpan semua orders

//     loadingMessage.remove();

//     // Update card statistik dari allOrders
//     updateOrderStats();

//     // Render daftar pesanan (default semua)
//     renderOrders("all");
//   } catch (error) {
//     if (loadingMessage) {
//         loadingMessage.textContent = `Error: ${error.message}`;
//     }
//   }
// }

// // Hitung dan update angka di card
// function updateOrderStats() {
//   const totalOrdersEl = document.getElementById("total-orders");
//   const deliveredOrdersEl = document.getElementById("delivered-orders");
//   const processingOrdersEl = document.getElementById("processing-orders");

//   if (!totalOrdersEl || !deliveredOrdersEl || !processingOrdersEl) {
//     console.warn("Elemen card tidak ditemukan di DOM.");
//     return;
//   }

//   const totalOrders = allOrders.length;
//   const deliveredOrders = allOrders.filter(
//     (order) => order.status.toLowerCase() === "shipped"
//   ).length;
//   const processingOrders = allOrders.filter(
//     (order) => order.status.toLowerCase() === "pending"
//   ).length;

//   totalOrdersEl.textContent = totalOrders;
//   deliveredOrdersEl.textContent = deliveredOrders;
//   processingOrdersEl.textContent = processingOrders;
// }

// // Render list pesanan sesuai filter
// function renderOrders(filter) {
//   const ordersContainer = document.getElementById("orders-container");
//   ordersContainer.innerHTML = "";

//   let filteredOrders = allOrders;
//   if (filter !== "all") {
//     filteredOrders = allOrders.filter(
//       (order) => order.status.toLowerCase() === filter
//     );
//   }

//   if (filteredOrders.length === 0) {
//     ordersContainer.innerHTML = "<p>Tidak ada pesanan untuk filter ini.</p>";
//     return;
//   }

//   filteredOrders.forEach((order) => {
//     const orderCard = document.createElement("div");
//     orderCard.className = "bg-[#181923] p-6 rounded-lg border border-gray-700";

//     const orderDate = new Date(order.order_date).toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     let itemsHtml = '<ul class="list-disc list-inside mt-2 text-gray-400">';
//     order.items.forEach((item) => {
//       itemsHtml += `<li>${item.quantity}x ${item.product_name}</li>`;
//     });
//     itemsHtml += "</ul>";

//     orderCard.innerHTML = `
//       <div class="flex justify-between items-center mb-2">
//         <h2 class="text-xl font-semibold">Order #${order.id}</h2>
//         <span class="px-3 py-1 text-sm rounded-full ${getStatusColor(
//           order.status
//         )}">${order.status}</span>
//       </div>
//       <p class="text-sm text-gray-400 mb-4">Date: ${orderDate}</p>
//       <div>
//         <h3 class="font-semibold">Items:</h3>
//         ${itemsHtml}
//       </div>
//       <div class="border-t border-gray-600 mt-4 pt-4 text-right">
//         <p class="text-lg font-bold">Total: $${new Intl.NumberFormat(
//           "en-US"
//         ).format(order.total_price)}</p>
//       </div>
//     `;
//     ordersContainer.appendChild(orderCard);
//   });
// }

// // Warna status
// function getStatusColor(status) {
//   switch (status.toLowerCase()) {
//     case "pending":
//       return "bg-yellow-500/20 text-yellow-400";
//     case "shipped":
//       return "bg-blue-500/20 text-blue-400";
//     case "cancelled":
//       return "bg-red-500/20 text-red-400";
//     default:
//       return "bg-gray-500/20 text-gray-400";
//   }
// }

// // Event filter dropdown
// // document.getElementById("filter-orders").addEventListener("change", (e) => {
// //   renderOrders(e.target.value);
// // });

// const filterOrdersDropdown = document.getElementById("filter-orders");

// // Jika elemennya ada, baru pasang event listener
// if (filterOrdersDropdown) {
//   filterOrdersDropdown.addEventListener("change", (e) => {
//     renderOrders(e.target.value);
//   });
// }

// // Load data saat halaman dibuka
// loadUserOrders();

// // EmailJs
// function initContactForm() {
//   const contactForm = document.getElementById("contact-form");
//   const submitButton = contactForm.querySelector('button[type="submit"]');
//   const originalButtonText = submitButton.innerHTML;

//   emailjs.init({ publicKey: "NYZE6VMcHdNBG8Nkz" });

//   contactForm.addEventListener("submit", function (event) {
//     event.preventDefault();
//     submitButton.innerHTML = "Sending...";
//     submitButton.disabled = true;

//     const serviceID = "service_k9z65yp";
//     const templateID = "template_n2u8isc";

//     emailjs
//       .sendForm(serviceID, templateID, this)
//       .then(
//         () => {
//           alert("Pesan Anda telah berhasil dikirim!");
//           contactForm.reset();
//         },
//         (err) => {
//           alert(
//             "Gagal mengirim pesan. Silakan coba lagi.\n" + JSON.stringify(err)
//           );
//         }
//       )
//       .finally(() => {
//         setTimeout(() => {
//           submitButton.innerHTML = originalButtonText;
//           submitButton.disabled = false;
//         }, 2000);
//       });
//   });
// }

// // Map
// function initLeafletMap() {
//   const myLocation = [-5.11218, 105.18437];
//   const mymap = L.map("mapid").setView(myLocation, 16);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(mymap);

//   const redIcon = new L.Icon({
//     iconUrl:
//       "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   });

//   L.marker(myLocation, { icon: redIcon })
//     .addTo(mymap)
//     .bindPopup("<b>Apparels 16</b><br>Toko Baju Terbaik di Kota Ini.")
//     .openPopup();
// }

// // Email Subscription
// function setupSubscriptionForm() {
//   const subscribeForm = document.getElementById("subscribe-form");

//   if (!subscribeForm) {
//     return;
//   }

//   const emailInput = document.getElementById("email-subscribe");
//   const messageDiv = document.getElementById("subscribe-message");
//   const submitButton = subscribeForm.querySelector('button[type="submit"]');
//   const originalButtonText = submitButton.innerText;

//   subscribeForm.addEventListener("submit", function (event) {
//     console.log(
//       "Checkpoint 4: Tombol subscribe diklik! Mencegah submit tradisional..."
//     );
//     event.preventDefault();

//     const email = emailInput.value;
//     const mailchimpUrl =
//       "https://gmail.us1.list-manage.com/subscribe/post?u=c5e3d99ba6b868f474e78ba43&id=cfe1309cbc&f_id=00a927e1f0".replace(
//         "/post?",
//         "/post-json?"
//       );

//     if (!email || !email.includes("@")) {
//       messageDiv.innerText = "Please enter a valid email address.";
//       messageDiv.style.color = "red";
//       return;
//     }

//     const url = `${mailchimpUrl}&${emailInput.name}=${encodeURIComponent(
//       email
//     )}`;

//     console.log("Checkpoint 5: Mengirim data ke URL:", url);

//     submitButton.innerText = "Subscribing...";
//     submitButton.disabled = true;

//     jsonp(url, { param: "c" }, (err, data) => {
//       submitButton.innerText = originalButtonText;
//       submitButton.disabled = false;

//       if (err) {
//         messageDiv.innerText = "An error occurred. Please try again.";
//         messageDiv.style.color = "red";
//         console.error("Error dari JSONP:", err);
//       } else if (data.result === "success") {
//         messageDiv.innerText = data.msg;
//         messageDiv.style.color = "green";
//         subscribeForm.reset();
//       } else {
//         let cleanMsg = data.msg.replace(/^\d+ - /, "");
//         messageDiv.innerText = cleanMsg;
//         messageDiv.style.color = "red";
//       }
//     });
//   });
// }

// document.addEventListener("DOMContentLoaded", setupSubscriptionForm);

// function jsonp(url, options, callback) {
//   const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
//   const script = document.createElement("script");

//   window[callbackName] = function (data) {
//     delete window[callbackName];
//     document.body.removeChild(script);
//     callback(null, data);
//   };

//   const param = options.param || "callback";
//   script.src = `${url}&${param}=${callbackName}`;
//   script.onerror = () => callback(new Error("JSONP request failed"));
//   document.body.appendChild(script);
// }

// // Love Animation
// function initLoveButtons() {
//   const productContainer = document.getElementById("cardContainer");
//   if (!productContainer) return;

//   productContainer.addEventListener("click", function (event) {
//     const loveButton = event.target.closest(".love-button");

//     if (!loveButton) return;
//     const heartIcon = loveButton.querySelector(".heart-icon");

//     heartIcon.classList.toggle("fill-pink-500");
//     heartIcon.classList.toggle("text-pink-500");

//     loveButton.classList.add("scale-125");
//     setTimeout(() => {
//       loveButton.classList.remove("scale-125");
//     }, 150);
//   });
// }
