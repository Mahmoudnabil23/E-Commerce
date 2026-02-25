let qty = 1;
const qtyInput = document.getElementById("qty-input");

document.getElementById("qty-minus").addEventListener("click", () => {
    if (qty > 1) { qty--; qtyInput.value = qty; }
});
document.getElementById("qty-plus").addEventListener("click", () => {
    qty++; qtyInput.value = qty;
});

document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const product = {
        id: 71,
        title: "iPhone 5s",
        price: 349.00,
        thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%205s/1.png",
        brand: "Apple",
        category: "smartphones"
    };

    let cartData = {};
    const stored = sessionStorage.getItem("cartData");
    if (stored) cartData = JSON.parse(stored);

    if (cartData[product.id]) {
        cartData[product.id].qty += qty;
    } else {
        cartData[product.id] = { product, qty };
    }

    sessionStorage.setItem("cartData", JSON.stringify(cartData));

    const btn = document.getElementById("add-to-cart-btn");
    btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Added!';
    btn.classList.replace("btn-primary", "btn-success");
    setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-cart-plus me-1"></i> Add to Cart';
        btn.classList.replace("btn-success", "btn-primary");
    }, 1500);
});
