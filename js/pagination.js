let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 9;

const productContainer = document.getElementById("product-container");
const paginationList = document.getElementById("pagination-list");
const resultsCount = document.getElementById("results-count");

fetch("https://dummyjson.com/products?limit=100")
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        filteredProducts = [...allProducts];
        refreshDisplay();
        if (typeof onProductsLoaded === "function") onProductsLoaded(allProducts);
    })
    .catch(err => console.error("Error fetching products:", err));

function applyFilter(subset) {
    filteredProducts = subset;
    currentPage = 1;
    refreshDisplay();
}

function refreshDisplay() {
    productContainer.innerHTML = "";

    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search fs-1 text-muted"></i>
                <p class="text-muted mt-3">No products match your filters.</p>
            </div>`;
        paginationList.innerHTML = "";
        resultsCount.innerHTML = `Showing <strong>0</strong> results`;
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredProducts.slice(startIndex, endIndex);

    pageItems.forEach(product => {
        const col = document.createElement("div");
        col.classList.add("col-md-6", "col-lg-4");
        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" style="height:200px;object-fit:cover;">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-light text-secondary mb-1" style="font-size:0.7rem;width:fit-content;">${product.brand ?? product.category}</span>
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="fw-bold text-primary">$${product.price}</span>
                        <span class="text-warning small">${"★".repeat(Math.round(product.rating))}${"☆".repeat(5 - Math.round(product.rating))}</span>
                    </div>
                    <a href="#" class="btn btn-primary w-100 mt-3 btn-add-to-cart" data-product-id="${product.id}">Add to Cart</a>
                </div>
            </div>`;
        productContainer.appendChild(col);
    });

    resultsCount.innerHTML = `Showing <strong>${filteredProducts.length}</strong> results`;
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    paginationList.innerHTML = "";

    if (totalPages <= 1) return;

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><i class="bi bi-chevron-left"></i></a>`;
    prevLi.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage > 1) { currentPage--; refreshDisplay(); scrollToGrid(); }
    });
    paginationList.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener("click", e => {
            e.preventDefault();
            currentPage = i;
            refreshDisplay();
            scrollToGrid();
        });
        paginationList.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><i class="bi bi-chevron-right"></i></a>`;
    nextLi.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage < totalPages) { currentPage++; refreshDisplay(); scrollToGrid(); }
    });
    paginationList.appendChild(nextLi);
}

function scrollToGrid() {
    productContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}