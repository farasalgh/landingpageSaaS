// Cart System
class Cart {
  constructor() {
    console.log("Cart constructor called"); // Debug log
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this.total = 0;
    this.count = 0;
    this.modal = document.getElementById("cartModal");
    this.isToastVisible = false;

    // Verify modal exists
    if (!this.modal) {
      console.error("Cart modal not found");
    }

    this.setupModal();
    this.updateCartCount();
    this.setupEventListeners();

    console.log("Cart initialized with items:", this.items); // Debug log
  }

  setupModal() {
    const closeBtn = document.getElementById("closeCartModal");
    const overlay = document.getElementById("cartOverlay");
    const clearBtn = document.getElementById("clearCart");
    const checkoutBtn = document.getElementById("checkoutCart");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
    if (overlay) overlay.addEventListener("click", () => this.closeModal());
    if (clearBtn) clearBtn.addEventListener("click", () => this.clearCart());
    if (checkoutBtn)
      checkoutBtn.addEventListener("click", () => this.checkout());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("hidden")) {
        this.closeModal();
      }
    });
  }

  setupEventListeners() {
    const cartButton = document.getElementById("cartButton");
    if (cartButton) {
      cartButton.addEventListener("click", () => this.openModal());
    }

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        const isOpen = !mobileMenu.classList.contains("hidden");
        const menuIcon = mobileMenuBtn.querySelector("svg");
        if (menuIcon) {
          menuIcon.innerHTML = isOpen
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
        }
      });
    }
  }

  addItem(item) {
    // Prevent adding if already processing
    if (this._isProcessing) return;
    this._isProcessing = true;

    try {
      const existingItem = this.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          quantity: 1,
        });
      }

      this.saveToLocalStorage();
      this.updateCartCount();
      this.animateCartButton();
      this.showNotification("Item added to cart!");
    } finally {
      // Reset processing flag
      setTimeout(() => {
        this._isProcessing = false;
      }, 500);
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.saveToLocalStorage();
    this.updateCartCount();
    this.renderCartItems();
    this.showNotification("Item removed from cart!");
  }

  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveToLocalStorage();
      this.updateCartCount();
      this.renderCartItems();
    }
  }

  clearCart() {
    this.items = [];
    this.saveToLocalStorage();
    this.updateCartCount();
    this.renderCartItems();
    this.showNotification("Cart cleared!");
  }

  checkout() {
    if (this.items.length === 0) {
      this.showNotification("Your cart is empty!", "error");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      this.showNotification("You must be logged in to checkout!", "error");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }

    localStorage.setItem("cartForCheckout", JSON.stringify(this.items));

    this.showNotification("Redirecting to checkout...", "success");
    setTimeout(() => {
      window.location.href = "checkout.html";
    }, 1000);
  }

  saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  updateCartCount() {
    this.count = this.items.reduce((total, item) => total + item.quantity, 0);
    this.total = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const cartBubbleCounter = document.getElementById("cartBubbleCounter");
    const cartTooltip = document.querySelector(".cart-tooltip");

    if (cartBubbleCounter) {
      cartBubbleCounter.textContent = this.count;
      cartBubbleCounter.style.display = this.count > 0 ? "flex" : "none";
      cartBubbleCounter.classList.add("scale-animation");
      setTimeout(
        () => cartBubbleCounter.classList.remove("scale-animation"),
        300
      );
    }

    if (cartTooltip) {
      cartTooltip.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>View Cart</span>
                    <span class="font-bold">($${this.total.toFixed(2)})</span>
                </div>
            `;
    }

    // Update cart totals in modal if open
    const cartTotalItems = document.getElementById("cartTotalItems");
    const cartTotalPrice = document.getElementById("cartTotalPrice");
    if (cartTotalItems) cartTotalItems.textContent = this.count;
    if (cartTotalPrice)
      cartTotalPrice.textContent = `$${this.total.toFixed(2)}`;
  }

  renderCartItems() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    container.innerHTML = "";

    if (this.items.length === 0) {
      container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p class="text-gray-400">Your cart is empty</p>
                </div>
            `;
      return;
    }

    this.items.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className =
        "cart-item flex items-center gap-4 bg-gray-800/50 rounded-lg p-4 animate-slideIn";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
                <img src="/public/images/${item.image_url}" alt="${
        item.title
      }" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="text-white font-semibold">${item.name}</h4>
                    <p class="text-blue-400">$${item.price.toFixed(2)}</p>
                    <p class="text-gray-400 text-sm">Total: $${(
                      item.price * item.quantity
                    ).toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button class="decrease-quantity p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700" data-id="${
                      item.id
                    }">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                    </button>
                    <span class="text-white min-w-[2rem] text-center font-medium">${
                      item.quantity
                    }</span>
                    <button class="increase-quantity p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700" data-id="${
                      item.id
                    }">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </button>
                </div>
                <button class="remove-item p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-900/20" data-id="${
                  item.id
                }">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            `;

      this.setupItemEventListeners(itemElement);
      container.appendChild(itemElement);
    });
  }

  setupItemEventListeners(itemElement) {
    const itemId = itemElement.querySelector(".remove-item").dataset.id;

    itemElement
      .querySelector(".decrease-quantity")
      .addEventListener("click", () => {
        const item = this.items.find((i) => i.id === itemId);
        if (item) this.updateQuantity(itemId, item.quantity - 1);
      });

    itemElement
      .querySelector(".increase-quantity")
      .addEventListener("click", () => {
        const item = this.items.find((i) => i.id === itemId);
        if (item) this.updateQuantity(itemId, item.quantity + 1);
      });

    itemElement.querySelector(".remove-item").addEventListener("click", () => {
      this.removeItem(itemId);
    });
  }

  openModal() {
    this.modal.classList.remove("hidden");
    this.renderCartItems();
    document.body.style.overflow = "hidden";
    this.modal.querySelector(".modal-content").classList.add("modal-open");
  }

  closeModal() {
    const modalContent = this.modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.classList.remove("modal-open");
      setTimeout(() => {
        this.modal.classList.add("hidden");
        document.body.style.overflow = "";
      }, 200);
    }
  }

  animateCartButton() {
    const cartButton = document.querySelector(".cart-bubble");
    if (cartButton) {
      cartButton.classList.add("cart-bounce");
      setTimeout(() => cartButton.classList.remove("cart-bounce"), 1000);
    }
  }

  // showNotification(message, type = "success") {
  //   if (this.isToastVisible) {
  //   return;
  // }

  // this.isToastVisible = true;

  //   const notification = document.createElement("div");
  //   notification.className = `fixed bottom-24 right-8 p-4 rounded-lg text-white ${
  //     type === "success" ? "bg-green-500" : "bg-red-500"
  //   } shadow-lg z-50 animate-slideIn`;
  //   notification.textContent = message;
  //   document.body.appendChild(notification);

  //   setTimeout(() => {
  //     notification.classList.add("animate-slideOut");
  //     setTimeout(() => notification.remove(), 300);
  //   }, 3000);
  // }

  showNotification(message, type = "success") {
    if (this.isToastVisible) {
      return;
    }

    this.isToastVisible = true;

    const notification = document.createElement("div");
    notification.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } shadow-lg z-[100] transition-all duration-300 transform translate-x-[120%]`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-[120%]");
    }, 100);

    setTimeout(() => {
      notification.classList.add("translate-x-[120%]");

      setTimeout(() => {
        notification.remove();
        this.isToastVisible = false;
      }, 300);
    }, 3000);
  }
}

// Global helper function untuk menambah item ke cart
window.addToCart = function (button) {
  // Prevent multiple clicks
  if (button.disabled) return;

  // selector card parent
  const card =
    button.closest(".card") || button.closest('[class*="bg-gray-900"]');

  if (card && window.cart) {
    try {
      // Disable button temporarily
      button.disabled = true;

      const title = card.querySelector("h6").textContent;
      const priceElement = card.querySelector("span.px-4.py-2");
      const price = parseFloat(priceElement.textContent.replace("$", ""));
      const image = card.querySelector("img").src;

      const item = {
        id: `item-${Date.now()}`,
        title,
        price,
        image,
      };

      // Store original button content
      const originalContent = button.innerHTML;

      // Change button appearance
      button.classList.add("bg-green-600");
      button.innerHTML = `
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Added!</span>
            `;

      // Add item to cart
      window.cart.addItem(item);

      // Reset button after delay with animation
      setTimeout(() => {
        // Add transition class for smooth return
        button.classList.add("transition-all", "duration-300");
        button.classList.remove("bg-green-600");

        // First fade out current content
        button.style.opacity = "0";

        setTimeout(() => {
          // Reset content
          button.innerHTML = originalContent;
          // Fade back in
          button.style.opacity = "1";
          // Re-enable button
          button.disabled = false;

          // Remove transition classes after animation
          setTimeout(() => {
            button.classList.remove("transition-all", "duration-300");
          }, 300);
        }, 300);
      }, 1500);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      button.disabled = false;
    }
  } else {
    console.error("Card not found or cart not initialized");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (!window.cart) {
    window.cart = new Cart();
  }
});
