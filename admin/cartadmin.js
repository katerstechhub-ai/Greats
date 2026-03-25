// ========== Configuration ==========
const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

const merchantId = localStorage.getItem('merchantId');
const authToken = localStorage.getItem('authToken');

if (!merchantId || !authToken) {
    showToast('Please log in first', 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
   
}

// DOM Elements
const cartsTableBody = document.getElementById('cartsTableBody');
const searchInput = document.getElementById('searchInput');
const totalCartsEl = document.getElementById('totalCarts');
const totalItemsEl = document.getElementById('totalItems');
const totalValueEl = document.getElementById('totalValue');
const uniqueUsersEl = document.getElementById('uniqueUsers');

// Modal Elements
const cartItemsModal = document.getElementById('cartItemsModal');
const closeCartModalBtn = document.getElementById('closeCartModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cartItemsList = document.getElementById('cartItemsList');
const modalTotal = document.getElementById('modalTotal');

// Delete Modal Elements
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// State
let allCarts = [];
let currentDeleteCartId = null;

// ========== Toast Notification ==========
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
    toast.style.animation = 'slideInRight 0.3s ease-out';
    toast.innerHTML = `
<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
<span class="flex-1 text-sm">${message}</span>
<button class="toast-close hover:text-gray-200 ml-2">
<i class="fas fa-times"></i>
</button>
`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.remove) {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    });
}

// ========== Helper: fetch with auth ==========
async function fetchAPI(url, options = {}) {
    const defaultHeaders = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await fetch(url, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

// ========== Helper: extract array from API response ==========
function extractCartsArray(response) {
    if (!response) return [];

    // If it's already an array
    if (Array.isArray(response)) return response;

    // If it has a data property that's an array
    if (response.data && Array.isArray(response.data)) return response.data;

    // If it has a carts property that's an array
    if (response.carts && Array.isArray(response.carts)) return response.carts;

    // If it has items property that's an array (like cart items)
    if (response.items && Array.isArray(response.items)) {
        // This might be a single cart with items
        return [{
            id: response.id || '1',
            user_id: response.user_id,
            user_name: response.user_name,
            items: response.items,
            total: response.total,
            updated_at: response.updated_at
        }];
    }

    // If it's an object with numeric keys (like a dictionary)
    if (typeof response === 'object') {
        const values = Object.values(response);
        if (values.length > 0 && values[0] && (values[0].items || values[0].products)) {
            return values;
        }
    }

    console.log('Unknown cart response structure:', response);
    return [];
}

// ========== Extract items from cart ==========
function extractCartItems(cart) {
    if (cart.items && Array.isArray(cart.items)) return cart.items;
    if (cart.products && Array.isArray(cart.products)) return cart.products;
    if (cart.cart_items && Array.isArray(cart.cart_items)) return cart.cart_items;
    return [];
}

// ========== Load Carts ==========
async function loadCarts() {
    cartsTableBody.innerHTML = `
<tr>
<td colspan="6" class="px-3 md:px-6 py-8 text-center text-gray-500">
<i class="fas fa-spinner fa-spin text-2xl"></i>
<p class="mt-2">Loading carts...</p>
</td>
</tr>
`;

    // Fetch carts
    const data = await fetchAPI(`${API_BASE}/carts?merchant_id=${merchantId}`);
    console.log('Carts API response:', data);

    allCarts = extractCartsArray(data);
    console.log('Processed carts:', allCarts);

    calculateStats();
    displayCarts(allCarts);
}

// ========== Calculate Statistics ==========
function calculateStats() {
    const totalCarts = allCarts.length;
    if (totalCartsEl) totalCartsEl.textContent = totalCarts;

    let totalItems = 0;
    let totalValue = 0;
    const uniqueUsers = new Set();

    allCarts.forEach(cart => {
        const items = extractCartItems(cart);
        totalItems += items.length;

        items.forEach(item => {
            const price = item.price || item.product_price || 0;
            const quantity = item.quantity || 1;
            totalValue += price * quantity;
        });

        if (cart.user_id || cart.userId || cart.customer_id) {
            uniqueUsers.add(cart.user_id || cart.userId || cart.customer_id);
        }
    });

    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
    if (uniqueUsersEl) uniqueUsersEl.textContent = uniqueUsers.size;
}

// ========== Display Carts ==========
function displayCarts(carts) {
    if (carts.length === 0) {
        cartsTableBody.innerHTML = `
<tr>
<td colspan="6" class="px-3 md:px-6 py-8 text-center text-gray-500">
<i class="fas fa-shopping-cart text-3xl mb-2"></i>
<p>No active carts found</p>
</td>
</tr>
`;
        return;
    }

    cartsTableBody.innerHTML = carts.map(cart => {
        const items = extractCartItems(cart);
        const total = items.reduce((sum, item) => {
            const price = item.price || item.product_price || 0;
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);

        const userName = cart.user_name || cart.customer_name || cart.user?.name || `User ${(cart.user_id || cart.userId || cart.customer_id)?.slice(-6) || 'Unknown'}`;
        const updatedAt = cart.updated_at || cart.updatedAt || cart.last_updated;

        // Escape cart data for safe JSON storage
        const itemsJson = JSON.stringify(items).replace(/"/g, '&quot;');

        return `
<tr class="hover:bg-gray-50 transition">
<td class="px-3 md:px-6 py-3 md:py-4">
<div class="text-sm font-medium text-gray-900">${escapeHtml(userName)}</div>
<div class="text-xs text-gray-500">ID: ${cart.user_id || cart.userId || cart.customer_id || 'N/A'}</div>
</td>
<td class="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-500">${items.length}</td>
<td class="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-blue-600">$${total.toFixed(2)}</td>
<td class="px-3 md:px-6 py-3 md:py-4">
<div class="flex flex-wrap gap-1">
${items.slice(0, 2).map(item => `
<span class="px-2 py-1 text-xs bg-gray-100 rounded-full">${escapeHtml(item.name || item.product_name || item.title || 'Product')}</span>
`).join('')}
${items.length > 2 ? `<span class="px-2 py-1 text-xs bg-gray-100 rounded-full">+${items.length - 2}</span>` : ''}
</div>
</td>
<td class="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-500">${formatDate(updatedAt)}</td>
<td class="px-3 md:px-6 py-3 md:py-4">
<div class="flex gap-2">
<button onclick="viewCartItems('${cart.id}', '${itemsJson}')"
class="text-blue-600 hover:text-blue-800 transition" title="View Items">
<i class="fas fa-eye"></i>
</button>
<button onclick="openDeleteModal('${cart.id}')"
class="text-red-600 hover:text-red-800 transition" title="Clear Cart">
<i class="fas fa-trash-alt"></i>
</button>
</div>
</td>
</tr>
`;
    }).join('');
}

// ========== View Cart Items ==========
window.viewCartItems = function (cartId, itemsJson) {
    let items;
    try {
        items = JSON.parse(itemsJson.replace(/&quot;/g, '"'));
    } catch (e) {
        const cart = allCarts.find(c => c.id === cartId);
        items = extractCartItems(cart);
    }

    let total = 0;

    cartItemsList.innerHTML = items.map(item => {
        const name = item.name || item.product_name || item.title || 'Product';
        const price = item.price || item.product_price || 0;
        const quantity = item.quantity || 1;
        const subtotal = price * quantity;
        total += subtotal;

        return `
<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
<div class="flex-1">
<p class="font-medium text-gray-800">${escapeHtml(name)}</p>
<p class="text-sm text-gray-500">Quantity: ${quantity}</p>
</div>
<div class="text-right">
<p class="font-semibold text-blue-600">$${price.toFixed(2)}</p>
<p class="text-xs text-gray-400">Subtotal: $${subtotal.toFixed(2)}</p>
</div>
</div>
`;
    }).join('');

    if (items.length === 0) {
        cartItemsList.innerHTML = '<p class="text-center text-gray-500 py-4">No items in this cart</p>';
    }

    modalTotal.textContent = `$${total.toFixed(2)}`;
    cartItemsModal.classList.remove('hidden');
    cartItemsModal.classList.add('flex');
};

function closeCartModal() {
    cartItemsModal.classList.add('hidden');
    cartItemsModal.classList.remove('flex');
}

// ========== Delete Cart (Clear Cart) ==========
function openDeleteModal(cartId) {
    currentDeleteCartId = cartId;
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    currentDeleteCartId = null;
}

async function clearCart(cartId) {
    // Try different endpoints to clear cart
    const endpoints = [
        `${API_BASE}/carts/${cartId}`,
        `${API_BASE}/carts/${cartId}/clear`,
        `${API_BASE}/cart/${cartId}`
    ];

    for (const url of endpoints) {
        const response = await fetchAPI(url, { method: 'DELETE' });
        if (response !== null) {
            showToast('✅ Cart cleared successfully!', 'success');
            await loadCarts();
            return true;
        }
    }

    showToast('❌ Failed to clear cart', 'error');
    return false;
}

// ========== Search Carts ==========
function searchCarts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        displayCarts(allCarts);
        return;
    }

    const filtered = allCarts.filter(cart => {
        const userName = (cart.user_name || cart.customer_name || cart.user?.name || '').toLowerCase();
        const items = extractCartItems(cart);
        const productNames = items.map(i => (i.name || i.product_name || '').toLowerCase()).join(' ');

        return userName.includes(searchTerm) || productNames.includes(searchTerm);
    });

    displayCarts(filtered);
}

// ========== Helper: Format Date ==========
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ========== Helper: Escape HTML ==========
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== Event Listeners ==========
searchInput.addEventListener('input', searchCarts);
closeCartModalBtn.addEventListener('click', closeCartModal);
closeModalBtn.addEventListener('click', closeCartModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
confirmDeleteBtn.addEventListener('click', async () => {
    if (currentDeleteCartId) {
        await clearCart(currentDeleteCartId);
        closeDeleteModal();
    }
});

// Close modals when clicking outside
cartItemsModal.addEventListener('click', (e) => {
    if (e.target === cartItemsModal) closeCartModal();
});
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});

// ========== Sign Out ==========
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('merchantId');
        localStorage.removeItem('authToken');
        showToast('Signed out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'loginadmin.html';
        }, 500);
    });
}

// ========== CSS Animations ==========
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

// ========== Initialize ==========
loadCarts();