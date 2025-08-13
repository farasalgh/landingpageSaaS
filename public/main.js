// --- Navbar Logic ---
const navLinks = [
  { href: "#hero", label: "Home", icon: "" },
  { href: "#about", label: "About", icon: "" },
  { href: "#services", label: "Services", icon: "" },
  { href: "#gallery", label: "Gallery", icon: "" },
  { href: "#contact", label: "Contact", icon: "" },
];

// Dark Mode State
let isDarkMode = false;

// Mobile Menu State
let isMobileMenuOpen = false;

// Active Section State
let activeSection = "";

// DOM references
const navbar = document.getElementById("navbar");
const navLinksContainer = document.getElementById("navLinksContainer");
const mobileNavLinksContainer = document.getElementById(
  "mobileNavLinksContainer"
);
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuIcon = document.getElementById("mobileMenuIcon");
const darkModeToggleDesktop = document.getElementById("darkModeToggleDesktop");
const darkModeToggleMobile = document.getElementById("darkModeToggleMobile");
const logo = document.getElementById("logo");

// Render navigation links (desktop & mobile)
function renderLinks() {
  navLinksContainer.innerHTML = "";
  mobileNavLinksContainer.innerHTML = "";
  navLinks.forEach((link) => {
    // Desktop link
    const a = document.createElement("a");
    a.href = link.href;
    a.className = "relative transition-colors font-medium";
    a.textContent = link.label;
    a.onclick = (e) => handleLinkClick(e, link.href);

    // Active style
    if (activeSection === link.href.substring(1)) {
      a.classList.add(isDarkMode ? "text-blue-300" : "text-blue-400");
    } else {
      a.classList.add(
        isDarkMode
          ? "text-white hover:text-blue-300"
          : "text-black hover:text-blue-600"
      );
    }
    navLinksContainer.appendChild(a);

    // Mobile link
    const ma = document.createElement("a");
    ma.href = link.href;
    ma.className = "block px-4 py-3 rounded-lg transition-all";
    ma.textContent = link.label;
    ma.onclick = (e) => handleLinkClick(e, link.href);

    if (activeSection === link.href.substring(1)) {
      ma.classList.add(
        isDarkMode
          ? "bg-blue-900/50 text-blue-300 font-medium"
          : "bg-blue-50 text-blue-600 font-medium"
      );
    } else {
      ma.classList.add(
        isDarkMode
          ? "text-gray-300 hover:bg-gray-700/50 hover:text-blue-300"
          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
      );
    }
    mobileNavLinksContainer.appendChild(ma);
  });
}

// Dark Mode Toggle Logic
function setDarkMode(dark) {
  isDarkMode = dark;
  document.body.classList.toggle("dark", isDarkMode);

  // Navbar colors
  if (window.scrollY > 50) {
    navbar.className = `fixed w-full z-50 transition-all duration-300 ${
      isDarkMode
        ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
        : "bg-white/95 backdrop-blur-md shadow-lg"
    }`;
  } else {
    navbar.className = `fixed w-full z-50 bg-gradient-to-b from-black/50 to-transparent transition-all duration-300`;
  }

  // Logo color
  logo.className = `text-2xl font-bold ${
    window.scrollY > 50
      ? "bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
      : isDarkMode
      ? "text-white"
      : "text-white"
  }`;

  // Desktop dark mode icon
  darkModeToggleDesktop.innerHTML = isDarkMode
    ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;

  // Mobile dark mode label
  darkModeToggleMobile.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
  darkModeToggleMobile.className =
    "w-full px-4 py-3 rounded-lg transition-all flex items-center " +
    (isDarkMode ? "text-gray-300" : "text-gray-700");

  renderLinks();
}

// Link click handler (scroll, close mobile menu)
function handleLinkClick(e, href) {
  if (e) e.preventDefault();
  isMobileMenuOpen = false;
  mobileMenu.classList.add("hidden");
  mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;

  const element = document.querySelector(href);
  if (element) {
    const offsetTop = element.offsetTop;
    window.scrollTo({ top: offsetTop - 80, behavior: "smooth" });
  }
}

// Scroll handler for navbar style & active section
function handleScroll() {
  // Navbar style
  if (window.scrollY > 50) {
    navbar.className = `fixed w-full z-50 transition-all duration-300 ${
      isDarkMode
        ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
        : "bg-white/95 backdrop-blur-md shadow-lg"
    }`;
    logo.className = `text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent`;
  } else {
    navbar.className = `fixed w-full z-50 bg-gradient-to-b from-black/50 to-transparent transition-all duration-300`;
    logo.className = `text-2xl font-bold text-white`;
  }

  // Active section logic
  const sections = ["hero", "about", "services", "gallery", "contact"];
  let currentActive = "";
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const element = document.getElementById(section);
    if (element) {
      const offset = 100;
      if (window.scrollY >= element.offsetTop - offset) {
        currentActive = section;
        break;
      }
    }
  }
  if (window.scrollY < document.getElementById("about")?.offsetTop - 100) {
    currentActive = "hero";
  }
  // Menandai 'gallery' aktif jika di path /gallery
  if (window.location.pathname === "/gallery") {
    currentActive = "gallery";
  }
  activeSection = currentActive;
  renderLinks();
}

// Mobile menu toggle
mobileMenuBtn.onclick = function () {
  isMobileMenuOpen = !isMobileMenuOpen;
  if (isMobileMenuOpen) {
    mobileMenu.classList.remove("hidden");
    mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
  } else {
    mobileMenu.classList.add("hidden");
    mobileMenuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
  }
};

// Dark mode toggle listeners
darkModeToggleDesktop.onclick = () => setDarkMode(!isDarkMode);
darkModeToggleMobile.onclick = () => setDarkMode(!isDarkMode);

// Logo scroll to hero
logo.onclick = (e) => handleLinkClick(e, "#hero");

// Initial render
setDarkMode(false);
handleScroll();

// Scroll listener
window.addEventListener("scroll", handleScroll);

// Responsive re-render
window.addEventListener("resize", () => renderLinks());

