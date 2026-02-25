function onProductsLoaded(products) {
    loadCategories(products);
}

function loadCategories(products) {
    const categorySet = new Set();
    products.forEach(p => {
        if (p.category) categorySet.add(p.category);
    });
    const categories = [...categorySet].sort();
    renderCategoryBar(categories);
    initFilters(products);
}

function renderCategoryBar(categories) {
    const bar = document.getElementById("category-bar");
    bar.innerHTML = "";

    const allBtn = makeCategoryPill("All", true);
    allBtn.addEventListener("click", () => {
        setActiveCategory(bar, allBtn);
        activeCategorySlug = null;
        applyAllFilters();
    });
    bar.appendChild(allBtn);

    categories.forEach(slug => {
        const label = formatLabel(slug);
        const btn = makeCategoryPill(label, false);
        btn.dataset.slug = slug;
        btn.addEventListener("click", () => {
            setActiveCategory(bar, btn);
            activeCategorySlug = slug;
            applyAllFilters();
        });
        bar.appendChild(btn);
    });
}

function makeCategoryPill(label, isActive) {
    const btn = document.createElement("button");
    btn.className = `btn rounded-pill px-4 btn-category ${isActive ? "btn-primary" : "btn-outline-secondary"}`;
    btn.textContent = label;
    return btn;
}

function setActiveCategory(bar, activeBtn) {
    bar.querySelectorAll(".btn-category").forEach(b => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline-secondary");
    });
    activeBtn.classList.remove("btn-outline-secondary");
    activeBtn.classList.add("btn-primary");
}

function formatLabel(slug) {
    return slug
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

let activeCategorySlug = null;

function initFilters(products) {
    const priceRange = document.getElementById("priceRange");
    const priceDisplay = document.getElementById("price-display");
    const sizeCheckboxes = document.querySelectorAll("[id^='size']");
    const brandCheckboxes = document.querySelectorAll("[id^='brand']");
    const sortSelect = document.getElementById("sort-select");
    const clearBtn = document.getElementById("clear-filters-btn");

    const sizePriceMap = {
        sizeSmall: { min: 0, max: 50 },
        sizeMedium: { min: 51, max: 200 },
        sizeLarge: { min: 201, max: 500 },
        sizeXL: { min: 501, max: Infinity }
    };

    const brandMap = {
        brandApple: "apple",
        brandSamsung: "samsung",
        brandNike: "nike",
        brandZara: "zara"
    };

    function updatePriceLabel(val) {
        if (priceDisplay) priceDisplay.textContent = `$0 – $${val}`;
    }
    updatePriceLabel(priceRange.value);

    function applyAllFilters() {
        let result = [...products];

        const q = (window.searchQuery || "").toLowerCase().trim();
        if (q) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.category && p.category.toLowerCase().includes(q))
            );
        }

        if (activeCategorySlug) {
            result = result.filter(p => p.category === activeCategorySlug);
        }

        const maxPrice = Number(priceRange.value);
        result = result.filter(p => p.price <= maxPrice);

        const checkedSizes = [...sizeCheckboxes].filter(cb => cb.checked);
        if (checkedSizes.length > 0) {
            result = result.filter(p =>
                checkedSizes.some(cb => {
                    const r = sizePriceMap[cb.id];
                    return p.price >= r.min && p.price <= r.max;
                })
            );
        }

        const checkedBrands = [...brandCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => brandMap[cb.id]);
        if (checkedBrands.length > 0) {
            result = result.filter(p =>
                p.brand && checkedBrands.includes(p.brand.toLowerCase())
            );
        }

        const sortVal = sortSelect.value;
        if (sortVal === "Price: Low to High") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortVal === "Price: High to Low") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortVal === "Top Rated") {
            result.sort((a, b) => b.rating - a.rating);
        }

        applyFilter(result);
    }

    window.applyAllFilters = applyAllFilters;

    function clearAllFilters() {
        priceRange.value = 1000;
        updatePriceLabel(1000);
        sizeCheckboxes.forEach(cb => cb.checked = false);
        brandCheckboxes.forEach(cb => cb.checked = false);
        sortSelect.value = sortSelect.options[0].value;
        activeCategorySlug = null;
        const bar = document.getElementById("category-bar");
        if (bar) setActiveCategory(bar, bar.querySelector(".btn-category"));
        applyFilter([...products]);
    }

    priceRange.addEventListener("input", () => {
        updatePriceLabel(priceRange.value);
        applyAllFilters();
    });
    sizeCheckboxes.forEach(cb => cb.addEventListener("change", applyAllFilters));
    brandCheckboxes.forEach(cb => cb.addEventListener("change", applyAllFilters));
    sortSelect.addEventListener("change", applyAllFilters);
    clearBtn.addEventListener("click", clearAllFilters);

    applyAllFilters();
}
