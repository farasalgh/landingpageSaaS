const cardContainer = document.getElementById("cardContainer");
const toggleButton = document.getElementById("toggleCards");
const toggleText = document.getElementById("toggleText");
const toggleIcon = document.getElementById("toggleIcon");
let isExpanded = false;

// Function to toggle card visibility
function toggleCards() {
  const cards = cardContainer.children;
  isExpanded = !isExpanded;

  for (let i = 3; i < cards.length; i++) {
    cards[i].style.display = isExpanded ? "block" : "none";
  }

  // Update button text and icon
  toggleText.textContent = isExpanded ? "Show Less" : "Show All";
  toggleIcon.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0)";
}

// Initial setup - hide cards beyond the first three
window.addEventListener("DOMContentLoaded", () => {
  const cards = cardContainer.children;
  for (let i = 3; i < cards.length; i++) {
    cards[i].style.display = "none";
  }
});

toggleButton.addEventListener("click", toggleCards);


