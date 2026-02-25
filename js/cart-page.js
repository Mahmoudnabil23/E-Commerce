let pageCart = {};

function loadCartFromSession() {
    const data = sessionStorage.getItem("cartData");
    if (data) pageCart = JSON.parse(data);
}

function renderCartPage() {
    const itemsContainer = document.getElementById("cart-page-items");
    const emptyMsg = document.getElementById("cart-page-empty");
    const summarySection = document.getElementById("cart-summary-section");
    const itemCount = document.getElementById("cart-item-count");
    const items = Object.values(pageCart);

    if (items.length === 0) {
        emptyMsg.style.display = "block";
        summarySection.style.display = "none";
        itemsContainer.innerHTML = "";
        itemCount.textContent = "0 items in your cart";
        document.getElementById("summary-total").textContent = "$0.00";
        return;
    }

    emptyMsg.style.display = "none";
    summarySection.style.display = "block";
    itemsContainer.innerHTML = "";

    let totalQty = 0;
    for (let i = 0; i < items.length; i++) {
        totalQty += items[i].qty;
    }
    itemCount.textContent = totalQty + " item" + (totalQty !== 1 ? "s" : "") + " in your cart";

    let total = 0;

    for (let i = 0; i < items.length; i++) {
        const product = items[i].product;
        const qty = items[i].qty;
        total += product.price * qty;
        const lineTotal = (product.price * qty).toFixed(2);

        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}"
                    style="height: 180px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 class="card-title fw-bold mb-0">${product.title}</h6>
                            <small class="text-muted">${product.brand || product.category || ""}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${product.id})" title="Remove">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="text-primary fw-bold fs-5">$${product.price}</span>
                        <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary" onclick="changeItemQty(${product.id}, -1)">−</button>
                            <span class="input-group-text bg-white border-secondary fw-bold flex-grow-1 justify-content-center">${qty}</span>
                            <button class="btn btn-outline-secondary" onclick="changeItemQty(${product.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="text-end mt-2">
                        <small class="text-muted">Line total: </small>
                        <span class="fw-bold">$${lineTotal}</span>
                    </div>
                </div>
            </div>
        `;
        itemsContainer.appendChild(col);
    }

    document.getElementById("summary-total").textContent = "$" + total.toFixed(2);
}

function removeItem(productId) {
    delete pageCart[productId];
    sessionStorage.setItem("cartData", JSON.stringify(pageCart));
    renderCartPage();
}

function changeItemQty(productId, delta) {
    if (!pageCart[productId]) return;
    pageCart[productId].qty += delta;
    if (pageCart[productId].qty <= 0) {
        removeItem(productId);
    } else {
        sessionStorage.setItem("cartData", JSON.stringify(pageCart));
        renderCartPage();
    }
}

document.getElementById("checkout-btn").addEventListener("click", function () {
    if (Object.keys(pageCart).length === 0) {
        alert("Your cart is empty!");
        return;
    }
    sessionStorage.setItem("lastOrder", JSON.stringify(Object.values(pageCart)));
    pageCart = {};
    sessionStorage.removeItem("cartData");
    window.location.href = "order.html";
});

loadCartFromSession();
renderCartPage();
