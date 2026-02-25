const sliderTrack = document.getElementById("slider-track");
const sliderDots = document.getElementById("slider-dots");
const prevBtn = document.getElementById("slider-prev");
const nextBtn = document.getElementById("slider-next");
let sliderProducts = [];
let currentSlide = 0;
let totalSlides = 0;
let autoSlideTimer = null;

if (sliderTrack) {

    fetch("https://dummyjson.com/products?limit=6&sortBy=rating&order=desc")
        .then(function (res) { return res.json(); })
        .then(function (data) {
            sliderProducts = data.products;
            if (!sliderProducts || sliderProducts.length === 0) return;

            sliderTrack.innerHTML = "";
            totalSlides = sliderProducts.length;

            for (let i = 0; i < sliderProducts.length; i++) {
                const product = sliderProducts[i];

                const card = document.createElement("div");
                card.className = "slider-card";
                card.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <div class="slider-card-body">
                        <span class="slider-badge">${product.category}</span>
                        <div class="slider-title">${product.title}</div>
                        <p class="text-muted small mb-2">${product.description}</p>
                        <div class="slider-meta">
                            <span class="slider-price">$${product.price}</span>
                            <span class="slider-rating"><i class="bi bi-star-fill"></i> ${product.rating.toFixed(1)}</span>
                        </div>
                        <button class="btn btn-primary w-100 mt-2 slider-add-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                `;
                sliderTrack.appendChild(card);
            }

            createDots();
            goToSlide(0);
            startAutoSlide();
        })
        .catch(function (err) {
            console.error("Slider error:", err);
            sliderTrack.innerHTML = '<p class="text-muted text-center py-5">Could not load products.</p>';
        });

    prevBtn.addEventListener("click", function () {
        currentSlide--;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        goToSlide(currentSlide);
        restartAutoSlide();
    });

    nextBtn.addEventListener("click", function () {
        currentSlide++;
        if (currentSlide >= totalSlides) currentSlide = 0;
        goToSlide(currentSlide);
        restartAutoSlide();
    });

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".slider-add-cart");
        if (!btn) return;

        const productId = Number(btn.getAttribute("data-product-id"));
        let product = null;

        for (let i = 0; i < sliderProducts.length; i++) {
            if (sliderProducts[i].id === productId) {
                product = sliderProducts[i];
                break;
            }
        }

        if (product && typeof addToCart === "function") {
            addToCart(product);
        }
    });
}

function createDots() {
    sliderDots.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        dot.className = "slider-dot";
        dot.setAttribute("data-index", i);
        dot.addEventListener("click", function () {
            const index = Number(this.getAttribute("data-index"));
            goToSlide(index);
            restartAutoSlide();
        });
        sliderDots.appendChild(dot);
    }
}

function goToSlide(index) {
    currentSlide = index;
    const cards = sliderTrack.querySelectorAll(".slider-card");
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    sliderTrack.style.transform = "translateX(-" + (currentSlide * cardWidth) + "px)";

    const dots = sliderDots.querySelectorAll(".slider-dot");
    for (let i = 0; i < dots.length; i++) {
        if (i === currentSlide) {
            dots[i].classList.add("active");
        } else {
            dots[i].classList.remove("active");
        }
    }
}

function startAutoSlide() {
    autoSlideTimer = setInterval(function () {
        currentSlide++;
        if (currentSlide >= totalSlides) currentSlide = 0;
        goToSlide(currentSlide);
    }, 3000);
}

function restartAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}
