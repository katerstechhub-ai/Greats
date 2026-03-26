// ========== API Configuration ==========
const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';
const merchantId = localStorage.getItem('merchantId');
const authToken = localStorage.getItem('authToken');

// ========== State ==========
let currentProduct = null;
let productImages = [];
let currentSlide = 0;
let cart = [];

// ========== Helper Functions ==========
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function showToast(message, type = 'info') {
    
    alert(message);
}

// ========== Fetch Product from API ==========
async function fetchProduct(productId) {
    try {
        let url = `${API_BASE}/products/${productId}`;
        let headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};

        console.log('Fetching product from:', url);
        const response = await fetch(url, { headers: headers });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        let data = await response.json();
        console.log('Product data:', data);

        // API might return product directly or nested
        if (data && data.id) return data;
        if (data && data.data && data.data.id) return data.data;
        if (data && data.product && data.product.id) return data.product;
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// ========== Fetch Category Name ==========
async function fetchCategoryName(categoryId) {
    if (!categoryId) return '';
    try {
        let url = `${API_BASE}/categories/${categoryId}`;
        let headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};

        const response = await fetch(url, { headers: headers });
        if (!response.ok) return '';

        let data = await response.json();
        if (data && data.name) return data.name;
        if (data && data.data && data.data.name) return data.data.name;
        return '';
    } catch (err) {
        console.error('Error fetching category:', err);
        return '';
    }
}

// ========== Image Slider ==========
function buildSlider(images) {
    productImages = images && images.length > 0 ? images : ['https://via.placeholder.com/600x600?text=Product'];
    currentSlide = 0;

    // Set main image
    let mainImg = document.getElementById('mainProductImage');
    if (mainImg) {
        mainImg.src = productImages[0];
        mainImg.alt = currentProduct ? currentProduct.title : 'Product';
    }

    // Build thumbnails
    let wrapper = document.getElementById('sliderWrapper');
    if (wrapper) {
        wrapper.innerHTML = '';
        for (let i = 0; i < productImages.length; i++) {
            let thumb = document.createElement('img');
            thumb.src = productImages[i];
            thumb.alt = `View ${i + 1}`;
            thumb.className = `w-16 h-16 object-cover cursor-pointer border-2 ${i === 0 ? 'border-black' : 'border-transparent'}`;
            thumb.dataset.index = i;
            thumb.addEventListener('click', () => goToSlide(i));
            wrapper.appendChild(thumb);
        }
    }

    // Build dots
    let dots = document.getElementById('sliderDots');
    if (dots) {
        dots.innerHTML = '';
        for (let i = 0; i < productImages.length; i++) {
            let dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300'}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToSlide(i));
            dots.appendChild(dot);
        }
    }
}

function goToSlide(index) {
    if (index < 0) index = productImages.length - 1;
    if (index >= productImages.length) index = 0;
    currentSlide = index;

    let mainImg = document.getElementById('mainProductImage');
    if (mainImg) mainImg.src = productImages[currentSlide];

    // Update thumbnails
    let thumbs = document.querySelectorAll('#sliderWrapper img');
    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].className = `w-16 h-16 object-cover cursor-pointer border-2 ${i === currentSlide ? 'border-black' : 'border-transparent'}`;
    }

    // Update dots
    let dots = document.querySelectorAll('#sliderDots button');
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = `w-2 h-2 rounded-full ${i === currentSlide ? 'bg-black' : 'bg-gray-300'}`;
    }
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

// ========== Populate Page ==========
function populatePage(product, categoryName) {
    // Title
    let titleEl = document.getElementById('productTitle');
    if (titleEl) titleEl.textContent = product.title || 'Product';

    // Price
    let priceEl = document.getElementById('productPrice');
    if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;

    // Color/Category
    let colorEl = document.getElementById('productColor');
    if (colorEl) colorEl.textContent = `Color: ${categoryName || 'N/A'}`;

    // Description
    let descEl = document.getElementById('productDescription');
    if (descEl) descEl.textContent = product.descp || product.description || 'No description available.';

    // Page title
    document.title = `${product.title || 'Product'} | Gre@ts`;

    // Build image slider
    let images = product.images && product.images.length > 0 ? product.images : [];
    buildSlider(images);

    // Add to recently viewed
    addToRecentlyViewed(product, categoryName);
}

// ========== Recently Viewed Functions ==========
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

    let viewedItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        images: product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/300x200?text=Product'],
        currentIndex: 0,
        productUrl: `productkingston.html?id=${product.id}`,
        color: categoryName || ''
    };

    recent = recent.filter(item => item.id !== viewedItem.id);
    recent.unshift(viewedItem);
    recent = recent.slice(0, 5);

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
        grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">No recently viewed items.</p>';
        return;
    }

    grid.innerHTML = '';

    for (let i = 0; i < recent.length; i++) {
        let item = recent[i];
        let currentImage = item.images[item.currentIndex] || 'https://via.placeholder.com/300x200?text=Product';

        let card = document.createElement('div');
        card.className = 'bg-white overflow-hidden transition';
        card.innerHTML = `
<a href="${item.productUrl}">
<img src="${currentImage}" alt="${escapeHtml(item.name)}" class="w-full h-auto object-cover">
</a>
<div class="flex justify-between items-start mt-2">
<h3 class="text-lg font-semibold text-gray-800">${escapeHtml(item.name)}</h3>
<p class="text-[15px] text-gray-900">$${Number(item.price).toFixed(2)}</p>
</div>
<p class="text-sm text-gray-600 italic">${escapeHtml(item.color)}</p>
`;
        grid.appendChild(card);
    }
}

// ========== Cart Functions ==========
function loadCart() {
    let saved = localStorage.getItem('shoppingCart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

function updateCartCount() {
    let cartCount = document.getElementById('cartCount');
    if (cartCount) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(productData) {
    let existingIndex = -1;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productData.id && cart[i].size === productData.size) {
            existingIndex = i;
            break;
        }
    }

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += productData.quantity;
    } else {
        cart.push(productData);
    }
    saveCart();
    openCartModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateQuantity(index, newQty) {
    if (newQty < 1) return;
    cart[index].quantity = newQty;
    saveCart();
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCartModal() {
    let container = document.getElementById('cartItemsContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">Your cart is empty.</div>';
        updateCartTotals();
        return;
    }

    let html = '';
    for (let idx = 0; idx < cart.length; idx++) {
        let item = cart[idx];
        html += `
<div class="flex gap-4 mb-6 p-3 border-b" data-cart-index="${idx}">
<img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover">
<div class="flex-1">
<div class="flex justify-between">
<h3 class="font-semibold text-gray-900">${escapeHtml(item.name)}</h3>
<button class="remove-item text-black rounded-full bg-gray-200 w-5 h-5 text-sm ml-4">X</button>
</div>
<p class="text-sm text-gray-600">${escapeHtml(item.color)}</p>
<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Size:</span> ${item.size}</p>
<div class="flex items-center justify-between mt-2">
<div class="flex items-center border">
<button class="qty-decrement px-3 py-1 border-r text-gray-600 hover:bg-gray-100">-</button>
<span class="qty-value px-3 py-1 text-gray-900">${item.quantity}</span>
<button class="qty-increment px-3 py-1 border-l text-gray-600 hover:bg-gray-100">+</button>
</div>
<span class="font-semibold text-gray-900">$${Number(item.price).toFixed(2)}</span>
</div>
</div>
</div>
`;
    }
    container.innerHTML = html;
    updateCartTotals();
}

function updateCartTotals() {
    let subtotal = calculateSubtotal();
    let subtotalSpan = document.getElementById('modalSubtotal');
    let installmentSpan = document.getElementById('installmentAmount');

    if (subtotalSpan) subtotalSpan.innerText = `$${subtotal.toFixed(2)}`;
    if (installmentSpan) installmentSpan.innerText = `$${(subtotal / 4).toFixed(2)}`;
}

function openCartModal() {
    let modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('translate-x-full');
            modal.classList.add('translate-x-0');
        }, 10);
    }
}

function closeCartModal() {
    let modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('translate-x-0');
        modal.classList.add('translate-x-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

// ========== Get Selected Size ==========
function getSelectedSize() {
    let selected = document.querySelector('input[name="size"]:checked');
    return selected ? selected.value : null;
}

// ========== Size Selector UI ==========
function initSizeSelector() {
    let radioButtons = document.querySelectorAll('input[name="size"]');
    let addToCartBtn = document.getElementById('add-to-cart-btn');

    if (!addToCartBtn) return;

    function resetAllSizeDivs() {
        for (let i = 0; i < radioButtons.length; i++) {
            let parent = radioButtons[i].closest('.flex.flex-col.items-center');
            let div = parent ? parent.querySelector('div') : null;
            if (div) {
                div.classList.remove('bg-black', 'text-white');
                div.classList.add('bg-gray-200', 'text-black');
            }
        }
    }

    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener('change', function () {
            resetAllSizeDivs();
            if (this.checked) {
                let parent = this.closest('.flex.flex-col.items-center');
                let div = parent ? parent.querySelector('div') : null;
                if (div) {
                    div.classList.remove('bg-gray-200', 'text-black');
                    div.classList.add('bg-black', 'text-white');
                }
            }
        });
    }

    addToCartBtn.addEventListener('mouseenter', function () {
        if (!getSelectedSize()) {
            this.textContent = 'SELECT A SIZE';
            this.classList.remove('bg-black', 'text-white');
            this.classList.add('bg-gray-200', 'text-black');
        }
    });

    addToCartBtn.addEventListener('mouseleave', function () {
        this.textContent = 'ADD TO CART';
        this.classList.remove('bg-gray-200', 'text-black');
        this.classList.add('bg-black', 'text-white');
    });
}

// ========== Event Listeners ==========
function setupEventListeners() {
    // Slider buttons
    let prevBtn = document.getElementById('sliderPrev');
    let nextBtn = document.getElementById('sliderNext');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Add to cart button
    let addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn && currentProduct) {
        addToCartBtn.addEventListener('click', function () {
            let selectedSize = getSelectedSize();
            if (!selectedSize) {
                alert('Please select a size');
                return;
            }

            let mainImg = document.getElementById('mainProductImage');
            let categoryName = document.getElementById('productColor')?.textContent.replace('Color: ', '') || '';

            let cartProduct = {
                id: String(currentProduct.id),
                name: currentProduct.title,
                color: categoryName,
                size: selectedSize,
                price: Number(currentProduct.price),
                image: mainImg ? mainImg.src : (productImages[0] || ''),
                quantity: 1
            };
            addToCart(cartProduct);
        });
    }

    // Cart modal events
    let cartIcon = document.getElementById('cart');
    let cancelBtn = document.getElementById('cancel');
    let continueBtn = document.getElementById('continueShoppingBtn');
    let checkoutBtn = document.getElementById('checkoutBtn');

    if (cartIcon) cartIcon.addEventListener('click', (e) => { e.preventDefault(); openCartModal(); });
    if (cancelBtn) cancelBtn.addEventListener('click', closeCartModal);
    if (continueBtn) continueBtn.addEventListener('click', closeCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => { window.location.href = './checkout.html'; });

    // Cart item events (delegation)
    let container = document.getElementById('cartItemsContainer');
    if (container) {
        container.addEventListener('click', function (e) {
            let target = e.target;
            let itemDiv = target.closest('[data-cart-index]');
            if (!itemDiv) return;

            let index = parseInt(itemDiv.dataset.cartIndex, 10);

            if (target.classList.contains('qty-decrement')) {
                if (cart[index].quantity - 1 >= 1) updateQuantity(index, cart[index].quantity - 1);
            } else if (target.classList.contains('qty-increment')) {
                updateQuantity(index, cart[index].quantity + 1);
            } else if (target.classList.contains('remove-item')) {
                removeFromCart(index);
            }
        });
    }

    // Recently viewed cycle buttons
    let filterLink = document.getElementById('filterLink');
    let gridToggleLink = document.getElementById('gridToggleLink');
    if (filterLink) filterLink.addEventListener('click', (e) => { e.preventDefault(); cycleRecentlyViewed(-1); });
    if (gridToggleLink) gridToggleLink.addEventListener('click', (e) => { e.preventDefault(); cycleRecentlyViewed(1); });

    // Newsletter
    let signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function (e) {
            e.preventDefault();
            let emailInput = document.getElementById('emailInput');
            let successMsg = document.getElementById('successMessage');
            let errorMsg = document.getElementById('errorMessage');
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let email = emailInput ? emailInput.value.trim() : '';

            if (errorMsg) errorMsg.classList.add('hidden');
            if (successMsg) successMsg.classList.add('hidden');

            if (email === '') {
                if (errorMsg) { errorMsg.textContent = 'Email cannot be empty.'; errorMsg.classList.remove('hidden'); }
            } else if (!emailRegex.test(email)) {
                if (errorMsg) { errorMsg.textContent = 'Please enter a valid email address.'; errorMsg.classList.remove('hidden'); }
            } else {
                if (successMsg) successMsg.classList.remove('hidden');
                if (emailInput) emailInput.value = '';
            }
        });
    }
}

// ========== Main Initialization ==========
document.addEventListener('DOMContentLoaded', async function () {
    // Get product ID from URL
    let params = new URLSearchParams(window.location.search);
    let productId = params.get('id');

    if (!productId) {
        document.getElementById('productTitle').textContent = 'Product not found';
        document.getElementById('productDescription').textContent = 'No product specified.';
        return;
    }

    // Fetch product
    let product = await fetchProduct(productId);

    if (!product) {
        document.getElementById('productTitle').textContent = 'Product not found';
        document.getElementById('productDescription').textContent = 'Could not load product details.';
        return;
    }

    currentProduct = product;

    // Fetch category name
    let categoryName = await fetchCategoryName(product.category_id);

    // Populate page
    populatePage(product, categoryName);

    // Load cart
    loadCart();

    // Initialize size selector
    initSizeSelector();

    // Setup event listeners
    setupEventListeners();
});