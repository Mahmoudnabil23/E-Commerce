const savedCart = sessionStorage.getItem("cartData");
let cart = savedCart ? JSON.parse(savedCart) : {};

const cartCount = document.getElementById("cart-count");
const cartOffcanvasCount = document.getElementById("cart-offcanvas-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartEmptyMsg = document.getElementById("cart-empty-msg");

function addToCart(product) {
    if (cart[product.id]) {
        cart[product.id].qty++;
    } else {
        cart[product.id] = { product, qty: 1 };
    }
    renderCart();
    updateCartBadge();
    saveCartToSession();
    flashCartIcon();
}

function removeFromCart(productId) {
    delete cart[productId];
    renderCart();
    updateCartBadge();
    saveCartToSession();
}

function changeQty(productId, delta) {
    if (!cart[productId]) return;
    cart[productId].qty += delta;
    if (cart[productId].qty <= 0) {
        removeFromCart(productId);
    } else {
        renderCart();
    }
    updateCartBadge();
    saveCartToSession();
}

function renderCart() {
    const items = Object.values(cart);
    cartEmptyMsg.style.display = items.length === 0 ? "block" : "none";

    cartItemsEl.querySelectorAll(".cart-row").forEach(el => el.remove());

    let total = 0;

    items.forEach(({ product, qty }) => {
        total += product.price * qty;

        const row = document.createElement("div");
        row.className = "cart-row d-flex gap-3 align-items-center mb-3 pb-3 border-bottom";
        row.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}"
                style="width:60px;height:60px;object-fit:cover;border-radius:8px;flex-shrink:0;">
            <div class="flex-grow-1">
                <div class="fw-semibold" style="font-size:0.85rem;">${product.title}</div>
                <div class="text-primary fw-bold">$${product.price}</div>
                <div class="d-flex align-items-center gap-2 mt-1">
                    <button class="btn btn-outline-secondary btn-sm px-2 py-0"
                        onclick="changeQty(${product.id}, -1)">−</button>
                    <span class="fw-semibold">${qty}</span>
                    <button class="btn btn-outline-secondary btn-sm px-2 py-0"
                        onclick="changeQty(${product.id}, 1)">+</button>
                </div>
            </div>
            <button class="btn btn-link text-danger p-0" onclick="removeFromCart(${product.id})" title="Remove">
                <i class="bi bi-trash3"></i>
            </button>`;
        cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartBadge() {
    const totalQty = Object.values(cart).reduce((sum, { qty }) => sum + qty, 0);
    cartCount.textContent = totalQty;
    cartOffcanvasCount.textContent = totalQty;
    cartCount.style.display = totalQty > 0 ? "inline" : "none";
}

function flashCartIcon() {
    const icon = document.getElementById("cart-btn");
    icon.classList.add("text-warning");
    setTimeout(() => icon.classList.remove("text-warning"), 300);
}

const _originalRefreshDisplay = window.refreshDisplay;

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-to-cart");
    if (!btn) return;
    e.preventDefault();
    const productId = parseInt(btn.dataset.productId, 10);
    const product = allProducts.find(p => p.id === productId);
    if (product) addToCart(product);
});

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (typeof applyAllFilters === "function") {
        window.searchQuery = query;
        applyAllFilters();
    }
});

function saveCartToSession() {
    sessionStorage.setItem("cartData", JSON.stringify(cart));
}

const goToCartBtn = document.getElementById("go-to-cart-btn");
if (goToCartBtn) {
    goToCartBtn.addEventListener("click", function () {
        saveCartToSession();
    });
}


renderCart();
updateCartBadge();
