const API_BASE = '/api';
const merchantId = '69c2565d1595cbe8104544cb';
const authToken = localStorage.getItem('authToken');


let currentProduct = null;
let productImages = [];
let currentSlide = 0;
let cart = [];


function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const toast = document.createElement('div');
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
    toast.style.animation = 'slideInRight 0.3s ease-out';
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span class="flex-1 text-sm">${message}</span>
        <button class="toast-close hover:text-gray-200 ml-2"><i class="fas fa-times"></i></button>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast && toast.remove) {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    });
}


async function fetchProduct(productId) {
    try {
        let headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
        const response = await fetch(`${API_BASE}/products/${productId}?merchant_id=${merchantId}`, { headers });
        if (!response.ok) throw new Error(`HTTPS ${response.status}`);

        let data = await response.json();
        console.log('Product data:', data);

        if (data && data.id) return data;
        if (data && data.data && data.data.id) return data.data;
        if (data && data.product && data.product.id) return data.product;
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

//Fetch Category Name
async function fetchCategoryName(categoryId) {
    if (!categoryId) return '';
    try {
        let headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
        const response = await fetch(`${API_BASE}/categories/${categoryId}?merchant_id=${merchantId}`, { headers });
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

    let mainImg = document.getElementById('mainProductImage');
    if (mainImg) {
        mainImg.src = productImages[0];
        mainImg.alt = currentProduct ? currentProduct.title : 'Product';
    }

    let wrapper = document.getElementById('sliderWrapper');
    if (wrapper) {
        wrapper.innerHTML = '';
        for (let i = 0; i < productImages.length; i++) {
            let thumb = document.createElement('img');
            thumb.src = productImages[i];
            thumb.alt = `View ${i + 1}`;
            thumb.className = `w-16 h-16 object-cover cursor-pointer border-2 ${i === 0 ? 'border-black' : 'border-transparent'}`;
            thumb.addEventListener('click', () => goToSlide(i));
            wrapper.appendChild(thumb);
        }
    }

    let dots = document.getElementById('sliderDots');
    if (dots) {
        dots.innerHTML = '';
        for (let i = 0; i < productImages.length; i++) {
            let dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300'}`;
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

    document.querySelectorAll('#sliderWrapper img').forEach((thumb, i) => {
        thumb.className = `w-16 h-16 object-cover cursor-pointer border-2 ${i === currentSlide ? 'border-black' : 'border-transparent'}`;
    });
    document.querySelectorAll('#sliderDots button').forEach((dot, i) => {
        dot.className = `w-2 h-2 rounded-full ${i === currentSlide ? 'bg-black' : 'bg-gray-300'}`;
    });
}

function prevSlide() { goToSlide(currentSlide - 1); }
function nextSlide() { goToSlide(currentSlide + 1); }

// Populate Page 
function populatePage(product, categoryName) {
    let titleEl = document.getElementById('productTitle');
    if (titleEl) titleEl.textContent = product.title || 'Product';

    let priceEl = document.getElementById('productPrice');
    if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;

    let colorEl = document.getElementById('productColor');
    if (colorEl) colorEl.textContent = `Color: ${categoryName || 'N/A'}`;

    let descEl = document.getElementById('productDescription');
    if (descEl) descEl.textContent = product.descp || product.description || 'No description available.';

    document.title = `${product.title || 'Product'} | Gre@ts`;

    buildSlider(product.images && product.images.length > 0 ? product.images : []);
    addToRecentlyViewed(product, categoryName);
}

//  Recently Viewed 
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
        images: product.images && product.images.length > 0
            ? product.images
            : ['https://via.placeholder.com/300x200?text=Product'],
        currentIndex: 0,
        productUrl: `./productkingston.html?id=${product.id}`,
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


// async function saveCartToAPI() {
//     if (cart.length === 0) return;

//     const cartPayload = {
//         merchant_id: merchantId,
//         user_id: localStorage.getItem('customerId') || null,
//         user_name: localStorage.getItem('customerName') || 'Guest',
//         items: cart.map(item => ({
//             product_id: String(item.id),
//             name: item.name,
//             size: item.size,
//             color: item.color,
//             quantity: item.quantity,
//             price: Number(item.price),
//             image: item.image || ''
//         })),
//         total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
//         updated_at: new Date().toISOString()
//     };

//     const headers = {
//         'Content-Type': 'application/json'
//     };

//     try {
//         let cartId = localStorage.getItem('cartSessionId');
//         let response;

//         if (cartId) {
//             response = await fetch(`${API_BASE}/carts/${cartId}`, {
//                 method: 'PUT',
//                 headers,
//                 body: JSON.stringify(cartPayload)
//             });
//             if (!response.ok) cartId = null;
//         }

//         if (!cartId) {
//             response = await fetch(`${API_BASE}/carts`, {
//                 method: 'POST',
//                 headers,
//                 body: JSON.stringify(cartPayload)
//             });
//         }

//         if (response && response.ok) {
//             const result = await response.json();
//             console.log('Cart synced to API:', result);
//             const serverId = result.id || result.data?.id || result.cart?.id;
//             if (serverId) localStorage.setItem('cartSessionId', String(serverId));
//         } else {
//             console.warn('Cart sync returned non-OK status:', response?.status);
//         }
//     } catch (error) {
//         console.warn('Cart sync error (non-fatal):', error.message);
//     }
// }

// ========== Delete Cart from API ==========

async function saveCartToAPI() {
    if (cart.length === 0) return;

    const cartPayload = {
        merchant_id: merchantId,
        user_id: localStorage.getItem('customerId') || null,
        user_name: localStorage.getItem('customerName') || 'Guest',
        items: cart.map(item => ({
            product_id: String(item.id),
            name: item.name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: Number(item.price),
            image: item.image || ''
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        updated_at: new Date().toISOString()
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };

    try {
        let cartId = localStorage.getItem('cartSessionId');
        let response;

        if (cartId) {
            response = await fetch(`${API_BASE}/carts/${cartId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(cartPayload)
            });
            if (!response.ok) cartId = null;
        }

        if (!cartId) {
            response = await fetch(`${API_BASE}/carts`, {
                method: 'POST',
                headers,
                body: JSON.stringify(cartPayload)
            });
        }

        if (response && response.ok) {
            const result = await response.json();
            console.log('✅ Cart synced to API:', result);
            const serverId = result.id || result.data?.id || result.cart?.id;
            if (serverId) localStorage.setItem('cartSessionId', String(serverId));
        } else {
            console.warn('Cart sync failed:', response?.status);
        }
    } catch (error) {
        console.warn('Cart sync error:', error.message);
    }
}



async function deleteCartFromAPI() {
    let cartId = localStorage.getItem('cartSessionId');
    if (!cartId) return;
    try {
        await fetch(`${API_BASE}/carts/${cartId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        localStorage.removeItem('cartSessionId');
        console.log('Empty cart removed from API');
    } catch (e) {
        console.warn('Cart delete error (non-fatal):', e.message);
    }
}

//  Local Cart Functions 
function loadCart() {
    let saved = localStorage.getItem('shoppingCart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
    renderCartModal();
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
    if (cart.length === 0) {
        deleteCartFromAPI();
    } else {
        saveCartToAPI();
    }
}

function updateCartCount() {
    let cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
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
    showToast(`Added "${productData.name}" to cart!`, 'success');
}

function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(`Removed "${removedItem.name}" from cart`, 'info');
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
                <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-24 h-24 object-cover">
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
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}

// ========== Size Selector ==========
function getSelectedSize() {
    let selected = document.querySelector('input[name="size"]:checked');
    return selected ? selected.value : null;
}

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

// Event Listeners 
function setupEventListeners() {
    let prevBtn = document.getElementById('sliderPrev');
    let nextBtn = document.getElementById('sliderNext');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    let addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            if (!currentProduct) return;
            let selectedSize = getSelectedSize();
            if (!selectedSize) { showToast('Please select a size', 'warning'); return; }

            let mainImg = document.getElementById('mainProductImage');
            let categoryName = (document.getElementById('productColor')?.textContent || '').replace('Color: ', '').trim();

            addToCart({
                id: String(currentProduct.id),
                name: currentProduct.title,
                color: categoryName,
                size: selectedSize,
                price: Number(currentProduct.price),
                image: mainImg ? mainImg.src : (productImages[0] || ''),
                quantity: 1
            });
        });
    }

    let cartIcon = document.getElementById('cart');
    let cancelBtn = document.getElementById('cancel');
    let continueBtn = document.getElementById('continueShoppingBtn');
    let checkoutBtn = document.getElementById('checkoutBtn');

    if (cartIcon) cartIcon.addEventListener('click', e => { e.preventDefault(); openCartModal(); });
    if (cancelBtn) cancelBtn.addEventListener('click', closeCartModal);
    if (continueBtn) continueBtn.addEventListener('click', closeCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => showToast('Checkout coming soon!', 'info'));

    let container = document.getElementById('cartItemsContainer');
    if (container) {
        container.addEventListener('click', function (e) {
            let itemDiv = e.target.closest('[data-cart-index]');
            if (!itemDiv) return;
            let index = parseInt(itemDiv.dataset.cartIndex, 10);
            if (e.target.classList.contains('qty-decrement')) {
                if (cart[index].quantity - 1 >= 1) updateQuantity(index, cart[index].quantity - 1);
            } else if (e.target.classList.contains('qty-increment')) {
                updateQuantity(index, cart[index].quantity + 1);
            } else if (e.target.classList.contains('remove-item')) {
                removeFromCart(index);
            }
        });
    }

    let filterLink = document.getElementById('filterLink');
    let gridToggleLink = document.getElementById('gridToggleLink');
    if (filterLink) filterLink.addEventListener('click', e => { e.preventDefault(); cycleRecentlyViewed(-1); });
    if (gridToggleLink) gridToggleLink.addEventListener('click', e => { e.preventDefault(); cycleRecentlyViewed(1); });

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

            if (!email) {
                if (errorMsg) { errorMsg.textContent = 'Email cannot be empty.'; errorMsg.classList.remove('hidden'); }
            } else if (!emailRegex.test(email)) {
                if (errorMsg) { errorMsg.textContent = 'Please enter a valid email address.'; errorMsg.classList.remove('hidden'); }
            } else {
                if (successMsg) successMsg.classList.remove('hidden');
                if (emailInput) emailInput.value = '';
                localStorage.setItem('customerEmail', email);
                showToast('Subscribed successfully!', 'success');
            }
        });
    }
}

//  CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Main Initialization 
document.addEventListener('DOMContentLoaded', async function () {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get('id');

    if (!productId) {
        let t = document.getElementById('productTitle');
        let d = document.getElementById('productDescription');
        if (t) t.textContent = 'Product not found';
        if (d) d.textContent = 'No product specified.';
        return;
    }

    let product = await fetchProduct(productId);
    if (!product) {
        let t = document.getElementById('productTitle');
        let d = document.getElementById('productDescription');
        if (t) t.textContent = 'Product not found';
        if (d) d.textContent = 'Could not load product details.';
        return;
    }

    currentProduct = product;
    let categoryName = await fetchCategoryName(product.category_id);
    populatePage(product, categoryName);
    loadCart();
    initSizeSelector();
    setupEventListeners();
});








// // ========== API Configuration ==========
// const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';
// const merchantId = '69c2565d1595cbe8104544cb';
// const authToken = localStorage.getItem('authToken');

// // ========== State ==========
// let currentProduct = null;
// let productImages = [];
// let currentSlide = 0;
// let cart = [];

// // ========== Helper Functions ==========
// function escapeHtml(str) {
//     if (!str) return '';
//     return String(str)
//         .replace(/&/g, '&amp;')
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;');
// }

// function showToast(message, type = 'info') {
//     let toastContainer = document.getElementById('toastContainer');
//     if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.id = 'toastContainer';
//         toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
//         document.body.appendChild(toastContainer);
//     }

//     const colors = {
//         success: 'bg-green-500',
//         error: 'bg-red-500',
//         info: 'bg-blue-500',
//         warning: 'bg-yellow-500'
//     };

//     const toast = document.createElement('div');
//     toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
//     toast.style.animation = 'slideInRight 0.3s ease-out';
//     toast.innerHTML = `
//         <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
//         <span class="flex-1 text-sm">${message}</span>
//         <button class="toast-close hover:text-gray-200 ml-2"><i class="fas fa-times"></i></button>
//     `;

//     toastContainer.appendChild(toast);
//     setTimeout(() => {
//         if (toast && toast.remove) {
//             toast.style.animation = 'slideOutRight 0.3s ease-in';
//             setTimeout(() => toast.remove(), 300);
//         }
//     }, 4000);
//     toast.querySelector('.toast-close').addEventListener('click', () => {
//         toast.style.animation = 'slideOutRight 0.3s ease-in';
//         setTimeout(() => toast.remove(), 300);
//     });
// }

// // ========== Check if user is logged in ==========
// function getCustomerId() {
//     return localStorage.getItem('customerId');
// }

// // ========== Fetch Product from API ==========
// async function fetchProduct(productId) {
//     try {
//         let headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
//         const response = await fetch(`${API_BASE}/products/${productId}?merchant_id=${merchantId}`, { headers });
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         let data = await response.json();
//         console.log('Product data:', data);

//         if (data && data.id) return data;
//         if (data && data.data && data.data.id) return data.data;
//         if (data && data.product && data.product.id) return data.product;
//         return data;
//     } catch (error) {
//         console.error('Error fetching product:', error);
//         return null;
//     }
// }

// // ========== Fetch Category Name ==========
// async function fetchCategoryName(categoryId) {
//     if (!categoryId) return '';
//     try {
//         let headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
//         const response = await fetch(`${API_BASE}/categories/${categoryId}?merchant_id=${merchantId}`, { headers });
//         if (!response.ok) return '';

//         let data = await response.json();
//         if (data && data.name) return data.name;
//         if (data && data.data && data.data.name) return data.data.name;
//         return '';
//     } catch (err) {
//         console.error('Error fetching category:', err);
//         return '';
//     }
// }

// // ========== Image Slider ==========
// function buildSlider(images) {
//     productImages = images && images.length > 0 ? images : ['https://via.placeholder.com/600x600?text=Product'];
//     currentSlide = 0;

//     let mainImg = document.getElementById('mainProductImage');
//     if (mainImg) {
//         mainImg.src = productImages[0];
//         mainImg.alt = currentProduct ? currentProduct.title : 'Product';
//     }

//     let wrapper = document.getElementById('sliderWrapper');
//     if (wrapper) {
//         wrapper.innerHTML = '';
//         for (let i = 0; i < productImages.length; i++) {
//             let thumb = document.createElement('img');
//             thumb.src = productImages[i];
//             thumb.alt = `View ${i + 1}`;
//             thumb.className = `w-16 h-16 object-cover cursor-pointer border-2 ${i === 0 ? 'border-black' : 'border-transparent'}`;
//             thumb.addEventListener('click', () => goToSlide(i));
//             wrapper.appendChild(thumb);
//         }
//     }

//     let dots = document.getElementById('sliderDots');
//     if (dots) {
//         dots.innerHTML = '';
//         for (let i = 0; i < productImages.length; i++) {
//             let dot = document.createElement('button');
//             dot.className = `w-2 h-2 rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300'}`;
//             dot.addEventListener('click', () => goToSlide(i));
//             dots.appendChild(dot);
//         }
//     }
// }

// function goToSlide(index) {
//     if (index < 0) index = productImages.length - 1;
//     if (index >= productImages.length) index = 0;
//     currentSlide = index;

//     let mainImg = document.getElementById('mainProductImage');
//     if (mainImg) mainImg.src = productImages[currentSlide];

//     document.querySelectorAll('#sliderWrapper img').forEach((thumb, i) => {
//         thumb.className = `w-16 h-16 object-cover cursor-pointer border-2 ${i === currentSlide ? 'border-black' : 'border-transparent'}`;
//     });
//     document.querySelectorAll('#sliderDots button').forEach((dot, i) => {
//         dot.className = `w-2 h-2 rounded-full ${i === currentSlide ? 'bg-black' : 'bg-gray-300'}`;
//     });
// }

// function prevSlide() { goToSlide(currentSlide - 1); }
// function nextSlide() { goToSlide(currentSlide + 1); }

// // ========== Populate Page ==========
// function populatePage(product, categoryName) {
//     let titleEl = document.getElementById('productTitle');
//     if (titleEl) titleEl.textContent = product.title || 'Product';

//     let priceEl = document.getElementById('productPrice');
//     if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;

//     let colorEl = document.getElementById('productColor');
//     if (colorEl) colorEl.textContent = `Color: ${categoryName || 'N/A'}`;

//     let descEl = document.getElementById('productDescription');
//     if (descEl) descEl.textContent = product.descp || product.description || 'No description available.';

//     document.title = `${product.title || 'Product'} | Gre@ts`;

//     buildSlider(product.images && product.images.length > 0 ? product.images : []);
//     addToRecentlyViewed(product, categoryName);
// }

// // ========== Recently Viewed ==========
// const STORAGE_KEY = 'recentlyViewed';

// function getStoredRecentlyViewed() {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     return stored ? JSON.parse(stored) : [];
// }

// function saveRecentlyViewed(items) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
// }

// function addToRecentlyViewed(product, categoryName) {
//     let recent = getStoredRecentlyViewed();
//     let viewedItem = {
//         id: product.id,
//         name: product.title,
//         price: product.price,
//         images: product.images && product.images.length > 0
//             ? product.images
//             : ['https://via.placeholder.com/300x200?text=Product'],
//         currentIndex: 0,
//         productUrl: `./productkingston.html?id=${product.id}`,
//         color: categoryName || ''
//     };

//     recent = recent.filter(item => item.id !== viewedItem.id);
//     recent.unshift(viewedItem);
//     recent = recent.slice(0, 5);
//     saveRecentlyViewed(recent);
//     renderRecentlyViewed();
// }

// function cycleRecentlyViewed(direction) {
//     let recent = getStoredRecentlyViewed();
//     if (recent.length === 0) return;

//     for (let i = 0; i < recent.length; i++) {
//         let item = recent[i];
//         let maxIndex = item.images.length - 1;
//         let newIndex = item.currentIndex + direction;
//         if (newIndex < 0) newIndex = maxIndex;
//         if (newIndex > maxIndex) newIndex = 0;
//         item.currentIndex = newIndex;
//     }
//     saveRecentlyViewed(recent);
//     renderRecentlyViewed();
// }

// function renderRecentlyViewed() {
//     let grid = document.getElementById('recently-viewed-grid');
//     if (!grid) return;

//     let recent = getStoredRecentlyViewed();
//     if (recent.length === 0) {
//         grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">No recently viewed items.</p>';
//         return;
//     }

//     grid.innerHTML = '';
//     for (let i = 0; i < recent.length; i++) {
//         let item = recent[i];
//         let currentImage = item.images[item.currentIndex] || 'https://via.placeholder.com/300x200?text=Product';
//         let card = document.createElement('div');
//         card.className = 'bg-white overflow-hidden transition';
//         card.innerHTML = `
//             <a href="${item.productUrl}">
//                 <img src="${currentImage}" alt="${escapeHtml(item.name)}" class="w-full h-auto object-cover">
//             </a>
//             <div class="flex justify-between items-start mt-2">
//                 <h3 class="text-lg font-semibold text-gray-800">${escapeHtml(item.name)}</h3>
//                 <p class="text-[15px] text-gray-900">$${Number(item.price).toFixed(2)}</p>
//             </div>
//             <p class="text-sm text-gray-600 italic">${escapeHtml(item.color)}</p>
//         `;
//         grid.appendChild(card);
//     }
// }

// // ========== Save extra cart info to localStorage (size, image, name) ==========
// function saveCartExtras(productId, size, image, name, price) {
//     let extras = JSON.parse(localStorage.getItem('cartExtras') || '{}');
//     extras[productId] = { size, image, name, price };
//     localStorage.setItem('cartExtras', JSON.stringify(extras));
// }

// function getCartExtras() {
//     return JSON.parse(localStorage.getItem('cartExtras') || '{}');
// }

// // ========== Add to Cart via API ==========
// async function addToCartAPI(productId, quantity) {
//     const customerId = getCustomerId();

//     if (!customerId) {
//         showToast('Please log in to add items to cart', 'warning');
//         setTimeout(() => { window.location.href = './login.html'; }, 1500);
//         return false;
//     }

//     try {
//         const response = await fetch(`${API_BASE}/carts`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 user_id: customerId,
//                 product_id: String(productId),
//                 has_variation: false,
//                 quantity: quantity
//             })
//         });

//         const text = await response.text();
//         let parsed;
//         try { parsed = JSON.parse(text); } catch (e) { parsed = {}; }

//         console.log('Cart API response:', parsed);

//         if (parsed.type === 'INVALID_CREDENTIAL' || parsed.code === 404) {
//             showToast('Failed to add to cart. Please try again.', 'error');
//             return false;
//         }

//         return true;
//     } catch (error) {
//         console.error('Add to cart error:', error);
//         showToast('Failed to add to cart. Please try again.', 'error');
//         return false;
//     }
// }

// // ========== Load Cart from API ==========
// async function loadCart() {
//     const customerId = getCustomerId();
//     cart = [];

//     if (!customerId) {
//         updateCartCount();
//         renderCartModal();
//         return;
//     }

//     try {
//         const response = await fetch(`${API_BASE}/carts?user_id=${customerId}`);
//         const text = await response.text();
//         let parsed;
//         try { parsed = JSON.parse(text); } catch (e) { parsed = {}; }

//         console.log('Load cart response:', parsed);

//         if (parsed.type === 'EMPTY_CART' || !parsed.data) {
//             cart = [];
//         } else {
//             let items = [];
//             if (Array.isArray(parsed.data)) {
//                 items = parsed.data;
//             } else if (parsed.data && Array.isArray(parsed.data.items)) {
//                 items = parsed.data.items;
//             } else if (Array.isArray(parsed)) {
//                 items = parsed;
//             }

//             const extras = getCartExtras();

//             cart = items.map(item => {
//                 const productId = item.product_id || item.id;
//                 const extra = extras[productId] || {};
//                 return {
//                     id: productId,
//                     name: extra.name || item.name || item.title || 'Product',
//                     size: extra.size || item.size || 'N/A',
//                     price: extra.price || Number(item.price || 0),
//                     image: extra.image || item.image || 'https://via.placeholder.com/100x100?text=Product',
//                     quantity: item.quantity || 1
//                 };
//             });
//         }
//     } catch (error) {
//         console.error('Load cart error:', error);
//         cart = [];
//     }

//     updateCartCount();
//     renderCartModal();
// }

// // ========== Update Cart Count ==========
// function updateCartCount() {
//     let cartCount = document.getElementById('cartCount');
//     if (cartCount) {
//         cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
//     }
// }

// // ========== Calculate Subtotal ==========
// function calculateSubtotal() {
//     return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
// }

// // ========== Render Cart Modal ==========
// function renderCartModal() {
//     let container = document.getElementById('cartItemsContainer');
//     if (!container) return;

//     if (cart.length === 0) {
//         container.innerHTML = '<div class="text-center py-8 text-gray-500">Your cart is empty.</div>';
//         updateCartTotals();
//         return;
//     }

//     let html = '';
//     for (let idx = 0; idx < cart.length; idx++) {
//         let item = cart[idx];
//         html += `
//             <div class="flex gap-4 mb-6 p-3 border-b" data-cart-index="${idx}">
//                 <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-24 h-24 object-cover">
//                 <div class="flex-1">
//                     <div class="flex justify-between">
//                         <h3 class="font-semibold text-gray-900">${escapeHtml(item.name)}</h3>
//                     </div>
//                     <p class="text-sm text-gray-600 mt-1"><span class="font-medium">Size:</span> ${item.size}</p>
//                     <div class="flex items-center justify-between mt-2">
//                         <span class="text-sm text-gray-600">Qty: ${item.quantity}</span>
//                         <span class="font-semibold text-gray-900">$${Number(item.price).toFixed(2)}</span>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }
//     container.innerHTML = html;
//     updateCartTotals();
// }

// function updateCartTotals() {
//     let subtotal = calculateSubtotal();
//     let subtotalSpan = document.getElementById('modalSubtotal');
//     let installmentSpan = document.getElementById('installmentAmount');
//     if (subtotalSpan) subtotalSpan.innerText = `$${subtotal.toFixed(2)}`;
//     if (installmentSpan) installmentSpan.innerText = `$${(subtotal / 4).toFixed(2)}`;
// }

// function openCartModal() {
//     let modal = document.getElementById('cartModal');
//     if (modal) {
//         modal.classList.remove('hidden');
//         setTimeout(() => {
//             modal.classList.remove('translate-x-full');
//             modal.classList.add('translate-x-0');
//         }, 10);
//     }
// }

// function closeCartModal() {
//     let modal = document.getElementById('cartModal');
//     if (modal) {
//         modal.classList.remove('translate-x-0');
//         modal.classList.add('translate-x-full');
//         setTimeout(() => modal.classList.add('hidden'), 300);
//     }
// }

// // ========== Size Selector ==========
// function getSelectedSize() {
//     let selected = document.querySelector('input[name="size"]:checked');
//     return selected ? selected.value : null;
// }

// function initSizeSelector() {
//     let radioButtons = document.querySelectorAll('input[name="size"]');
//     let addToCartBtn = document.getElementById('add-to-cart-btn');
//     if (!addToCartBtn) return;

//     function resetAllSizeDivs() {
//         for (let i = 0; i < radioButtons.length; i++) {
//             let parent = radioButtons[i].closest('.flex.flex-col.items-center');
//             let div = parent ? parent.querySelector('div') : null;
//             if (div) {
//                 div.classList.remove('bg-black', 'text-white');
//                 div.classList.add('bg-gray-200', 'text-black');
//             }
//         }
//     }

//     for (let i = 0; i < radioButtons.length; i++) {
//         radioButtons[i].addEventListener('change', function () {
//             resetAllSizeDivs();
//             if (this.checked) {
//                 let parent = this.closest('.flex.flex-col.items-center');
//                 let div = parent ? parent.querySelector('div') : null;
//                 if (div) {
//                     div.classList.remove('bg-gray-200', 'text-black');
//                     div.classList.add('bg-black', 'text-white');
//                 }
//             }
//         });
//     }

//     addToCartBtn.addEventListener('mouseenter', function () {
//         if (!getSelectedSize()) {
//             this.textContent = 'SELECT A SIZE';
//             this.classList.remove('bg-black', 'text-white');
//             this.classList.add('bg-gray-200', 'text-black');
//         }
//     });
//     addToCartBtn.addEventListener('mouseleave', function () {
//         this.textContent = 'ADD TO CART';
//         this.classList.remove('bg-gray-200', 'text-black');
//         this.classList.add('bg-black', 'text-white');
//     });
// }

// // ========== Event Listeners ==========
// function setupEventListeners() {
//     let prevBtn = document.getElementById('sliderPrev');
//     let nextBtn = document.getElementById('sliderNext');
//     if (prevBtn) prevBtn.addEventListener('click', prevSlide);
//     if (nextBtn) nextBtn.addEventListener('click', nextSlide);

//     let addToCartBtn = document.getElementById('add-to-cart-btn');
//     if (addToCartBtn) {
//         addToCartBtn.addEventListener('click', async function () {
//             if (!currentProduct) return;

//             const customerId = getCustomerId();
//             if (!customerId) {
//                 showToast('Please log in to add items to cart', 'warning');
//                 setTimeout(() => { window.location.href = './login.html'; }, 1500);
//                 return;
//             }

//             let selectedSize = getSelectedSize();
//             if (!selectedSize) {
//                 showToast('Please select a size', 'warning');
//                 return;
//             }

//             let mainImg = document.getElementById('mainProductImage');
//             const image = mainImg ? mainImg.src : (productImages[0] || '');

//             // Save extra details to localStorage
//             saveCartExtras(
//                 String(currentProduct.id),
//                 selectedSize,
//                 image,
//                 currentProduct.title,
//                 Number(currentProduct.price)
//             );

//             // Add to API cart
//             const success = await addToCartAPI(String(currentProduct.id), 1);
//             if (success) {
//                 showToast(`Added "${currentProduct.title}" to cart!`, 'success');
//                 await loadCart();
//                 openCartModal();
//             }
//         });
//     }

//     let cartIcon = document.getElementById('cart');
//     let cancelBtn = document.getElementById('cancel');
//     let continueBtn = document.getElementById('continueShoppingBtn');
//     let checkoutBtn = document.getElementById('checkoutBtn');

//     if (cartIcon) cartIcon.addEventListener('click', e => { e.preventDefault(); openCartModal(); });
//     if (cancelBtn) cancelBtn.addEventListener('click', closeCartModal);
//     if (continueBtn) continueBtn.addEventListener('click', closeCartModal);
//     if (checkoutBtn) checkoutBtn.addEventListener('click', () => showToast('Checkout coming soon!', 'info'));

//     let filterLink = document.getElementById('filterLink');
//     let gridToggleLink = document.getElementById('gridToggleLink');
//     if (filterLink) filterLink.addEventListener('click', e => { e.preventDefault(); cycleRecentlyViewed(-1); });
//     if (gridToggleLink) gridToggleLink.addEventListener('click', e => { e.preventDefault(); cycleRecentlyViewed(1); });

//     let signupBtn = document.getElementById('signupBtn');
//     if (signupBtn) {
//         signupBtn.addEventListener('click', function (e) {
//             e.preventDefault();
//             let emailInput = document.getElementById('emailInput');
//             let successMsg = document.getElementById('successMessage');
//             let errorMsg = document.getElementById('errorMessage');
//             let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             let email = emailInput ? emailInput.value.trim() : '';

//             if (errorMsg) errorMsg.classList.add('hidden');
//             if (successMsg) successMsg.classList.add('hidden');

//             if (!email) {
//                 if (errorMsg) { errorMsg.textContent = 'Email cannot be empty.'; errorMsg.classList.remove('hidden'); }
//             } else if (!emailRegex.test(email)) {
//                 if (errorMsg) { errorMsg.textContent = 'Please enter a valid email address.'; errorMsg.classList.remove('hidden'); }
//             } else {
//                 if (successMsg) successMsg.classList.remove('hidden');
//                 if (emailInput) emailInput.value = '';
//                 showToast('Subscribed successfully!', 'success');
//             }
//         });
//     }
// }

// // ========== CSS Animations ==========
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes slideInRight {
//         from { transform: translateX(100%); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//     }
//     @keyframes slideOutRight {
//         from { transform: translateX(0); opacity: 1; }
//         to { transform: translateX(100%); opacity: 0; }
//     }
// `;
// document.head.appendChild(style);

// // ========== Main Initialization ==========
// document.addEventListener('DOMContentLoaded', async function () {
//     let params = new URLSearchParams(window.location.search);
//     let productId = params.get('id');

//     if (!productId) {
//         let t = document.getElementById('productTitle');
//         let d = document.getElementById('productDescription');
//         if (t) t.textContent = 'Product not found';
//         if (d) d.textContent = 'No product specified.';
//         return;
//     }

//     let product = await fetchProduct(productId);
//     if (!product) {
//         let t = document.getElementById('productTitle');
//         let d = document.getElementById('productDescription');
//         if (t) t.textContent = 'Product not found';
//         if (d) d.textContent = 'Could not load product details.';
//         return;
//     }

//     currentProduct = product;
//     let categoryName = await fetchCategoryName(product.category_id);
//     populatePage(product, categoryName);
//     await loadCart();
//     initSizeSelector();
//     setupEventListeners();
// });