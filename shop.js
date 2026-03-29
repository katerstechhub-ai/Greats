
const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';
const merchantId = '69c2565d1595cbe8104544cb';
const authToken = localStorage.getItem('authToken');


let allProducts = [];
let allCategories = [];

// Recently Viewed Storage
const STORAGE_KEY = 'recentlyViewed';

function getStoredRecentlyViewed() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveRecentlyViewed(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addToRecentlyViewed(product, categoryName) {
    let recent = getStoredRecentlyViewed();

    const viewedItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        images: product.images && product.images.length > 0
            ? product.images
            : ['https://via.placeholder.com/300x200?text=Product'],
        currentIndex: 0,
        productUrl: './productkingston.html?id=' + product.id,
        color: categoryName || product.color || ''
    };

    recent = recent.filter(function (item) { return item.id !== viewedItem.id; });
    recent.unshift(viewedItem);
    recent = recent.slice(0, 3);

    saveRecentlyViewed(recent);
    renderRecentlyViewed();
}

function cycleRecentlyViewed(direction) {
    let recent = getStoredRecentlyViewed();
    if (recent.length === 0) return;

    for (let i = 0; i < recent.length; i++) {
        let item = recent[i];
        let maxIndex = item.images.length - 1;
        let newIndex = item.currentIndex + direction;
        if (newIndex < 0) newIndex = maxIndex;
        if (newIndex > maxIndex) newIndex = 0;
        item.currentIndex = newIndex;
    }

    saveRecentlyViewed(recent);
    renderRecentlyViewed();
}

function renderRecentlyViewed() {
    let grid = document.getElementById('recently-viewed-grid');
    if (!grid) return;

    let recent = getStoredRecentlyViewed();

    if (recent.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 col-span-3">No recently viewed items.</p>';
        return;
    }

    grid.innerHTML = '';

    for (let i = 0; i < recent.length; i++) {
        let item = recent[i];
        let currentImage = item.images[item.currentIndex] || 'https://via.placeholder.com/300x200?text=Product';

        let card = document.createElement('div');
        card.className = 'bg-white overflow-hidden transition';
        card.innerHTML =
            '<a href="' + item.productUrl + '">' +
            '<img src="' + currentImage + '" alt="' + escapeHtml(item.name) + '" class="w-full h-auto object-cover">' +
            '</a>' +
            '<div class="flex justify-between items-start mt-2">' +
            '<h3 class="text-lg font-semibold text-gray-800">' + escapeHtml(item.name) + '</h3>' +
            '<p class="text-[15px] text-gray-900">$' + Number(item.price).toFixed(2) + '</p>' +
            '</div>' +
            '<p class="text-sm text-gray-600 italic">' + escapeHtml(item.color) + '</p>';

        grid.appendChild(card);
    }
}

// Fetch ALL Products 
async function fetchAllProducts() {
    let allFetchedProducts = [];
    let page = 1;
    const limit = 100;

    try {
        while (true) {
            let url = API_BASE + '/products?merchant_id=' + merchantId + '&page=' + page + '&limit=' + limit;
            let headers = authToken ? { 'Authorization': 'Bearer ' + authToken } : {};

            console.log('Fetching products page ' + page + '...');
            let response = await fetch(url, { headers: headers });
            if (!response.ok) throw new Error('HTTP ' + response.status);

            let data = await response.json();

            let products = [];
            if (Array.isArray(data)) {
                products = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                products = data.data;
            } else if (data && data.products && Array.isArray(data.products)) {
                products = data.products;
            }

            if (products.length === 0) break;

            allFetchedProducts = allFetchedProducts.concat(products);
            console.log('Page ' + page + ': Got ' + products.length + ' products, Total: ' + allFetchedProducts.length);

            if (products.length < limit) break;
            if (data && data.pagination && page >= data.pagination.total_pages) break;

            page++;
            if (page > 50) break;
        }

        console.log('Total products fetched:', allFetchedProducts.length);
        return allFetchedProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

//Fetch Categories 
async function fetchCategories() {
    try {
        let url = API_BASE + '/categories?merchant_id=' + merchantId;
        let headers = authToken ? { 'Authorization': 'Bearer ' + authToken } : {};

        let response = await fetch(url, { headers: headers });
        if (!response.ok) throw new Error('HTTP ' + response.status);

        let data = await response.json();

        let categories = [];
        if (Array.isArray(data)) {
            categories = data;
        } else if (data && data.data && Array.isArray(data.data)) {
            categories = data.data;
        }

        console.log('Categories loaded:', categories.length);
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Render Products Grid 
function renderProducts(products) {
    let grid = document.getElementById('product-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">No products available at the moment.</p>';
        return;
    }

    grid.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        let imageUrl = product.images && product.images[0]
            ? product.images[0]
            : 'https://via.placeholder.com/300x200?text=Product';

        let category = null;
        for (let j = 0; j < allCategories.length; j++) {
            if (String(allCategories[j].id) === String(product.category_id)) {
                category = allCategories[j];
                break;
            }
        }
        let colorText = category ? category.name : (product.color || '');

        let card = document.createElement('div');
        card.className = 'bg-white overflow-hidden transition cursor-pointer';

        card.innerHTML =
            '<a href="./productkingston.html?id=' + product.id + '" class="product-link block">' +
            '<img src="' + imageUrl + '" alt="' + escapeHtml(product.title) + '" class="w-full h-auto object-cover">' +
            '</a>' +
            '<div class="flex justify-between items-start mt-2">' +
            '<h3 class="text-lg font-semibold text-gray-800">' + escapeHtml(product.title) + '</h3>' +
            '<p class="text-[15px] text-gray-900">$' + Number(product.price).toFixed(2) + '</p>' +
            '</div>' +
            '<p class="text-sm text-gray-600 italic">' + escapeHtml(colorText) + '</p>';

        let link = card.querySelector('.product-link');
        link.dataset.colorText = colorText;
        link.addEventListener('click', function () {
            addToRecentlyViewed(product, this.dataset.colorText);
        });

        grid.appendChild(card);
    }

    let productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = products.length;
    }
}


function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

//Initialize Page
async function init() {
    let grid = document.getElementById('product-grid');
    if (grid) {
        grid.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Loading products...</p>';
    }

    allCategories = await fetchCategories();
    let products = await fetchAllProducts();
    allProducts = products;

    renderProducts(allProducts);
    renderRecentlyViewed();
}


document.addEventListener('DOMContentLoaded', function () {
    init();

    let product_arr = [
        { id: 1, name: "Men's New Arrivals", link: "", image: "Home.img/shopI.webp" },
        { id: 2, name: "Women's New Arrivals", link: "", image: "Home.img/shopII.webp" }
    ];

    let productContainer = document.getElementById('products');
    if (productContainer) {
        productContainer.innerHTML = '';
        for (let i = 0; i < product_arr.length; i++) {
            let content =
                '<div class="p-2">' +
                '<img src="' + product_arr[i].image + '" alt="' + product_arr[i].name + '" class="h-50 object-cover mb-2">' +
                '<a href="' + product_arr[i].link + '" class="inline-block cursor-pointer text-md font-medium hover:text-black">' + product_arr[i].name + '</a>' +
                '</div>';
            productContainer.innerHTML += content;
        }
    }

    let filterLink = document.getElementById('filterLink');
    if (filterLink) {
        filterLink.addEventListener('click', function (e) {
            e.preventDefault();
            cycleRecentlyViewed(-1);
        });
    }

    let gridToggleLink = document.getElementById('gridToggleLink');
    if (gridToggleLink) {
        gridToggleLink.addEventListener('click', function (e) {
            e.preventDefault();
            cycleRecentlyViewed(1);
        });
    }

    let signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function (e) {
            e.preventDefault();
            let emailInput = document.getElementById('emailInput');
            let successMessage = document.getElementById('successMessage');
            let errorMessage = document.getElementById('errorMessage');
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let email = emailInput.value.trim();

            errorMessage.classList.add('hidden');
            successMessage.classList.add('hidden');

            if (email === '') {
                errorMessage.textContent = 'Email cannot be empty.';
                errorMessage.classList.remove('hidden');
            } else if (!emailRegex.test(email)) {
                errorMessage.textContent = 'Please enter a valid email address.';
                errorMessage.classList.remove('hidden');
            } else {
                successMessage.classList.remove('hidden');
            }
        });
    }
});