checkAuthStatus();

function checkAuthStatus() {
  const authToken = localStorage.getItem("authToken");
  const publicPages = ["login.html", "register.html"];
  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  if (!authToken) {
    if (!publicPages.includes(currentPage)) {
      console.log(
        "Akses ditolak! Anda belum login. Mengarahkan ke halaman login..."
      );
      window.location.href = "login.html";
    }
  }
  else {
    if (publicPages.includes(currentPage)) {
      window.location.href = "index.html";
    }
  }
}

// init
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("contact-form")) {
    initContactForm();
  }

  if (document.getElementById("mapid")) {
    initLeafletMap();
  }
});

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

// User Profile Dropdown
const profileButton = document.getElementById("profile-button");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutButton = document.getElementById("logout-button");

let isDropdownOpen = false;

const toggleDropdown = () => {
  isDropdownOpen = !isDropdownOpen;
  if (isDropdownOpen) {
    profileDropdown.classList.remove("hidden");
    requestAnimationFrame(() => {
      profileDropdown.classList.remove("opacity-0", "scale-95");
      profileDropdown.classList.add("opacity-100", "scale-100");
    });
  } else {
    profileDropdown.classList.remove("opacity-100", "scale-100");
    profileDropdown.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      profileDropdown.classList.add("hidden");
    }, 200);
  }
};

profileButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleDropdown();
});

if (logoutButton) {
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("authToken");
    alert("Anda telah berhasil logout.");
    window.location.href = "login.html";
  });
}

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
