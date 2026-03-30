// // ========== Configuration ==========
// const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';
// const merchantId = '69c2565d1595cbe8104544cb';
// const authToken = localStorage.getItem('authToken');

// if (!authToken) {
//     showToast('Please log in first', 'error');
//     setTimeout(() => {
//         window.location.href = 'loginadmin.html';
//     }, 1500);
// }

// // ========== DOM Elements ==========
// const cartsTableBody = document.getElementById('cartsTableBody');
// const searchInput = document.getElementById('searchInput');
// const totalCartsEl = document.getElementById('totalCarts');
// const totalItemsEl = document.getElementById('totalItems');
// const totalValueEl = document.getElementById('totalValue');
// const uniqueUsersEl = document.getElementById('uniqueUsers');

// const cartItemsModal = document.getElementById('cartItemsModal');
// const closeCartModalBtn = document.getElementById('closeCartModalBtn');
// const closeModalBtn = document.getElementById('closeModalBtn');
// const cartItemsList = document.getElementById('cartItemsList');
// const modalTotal = document.getElementById('modalTotal');

// const deleteModal = document.getElementById('deleteModal');
// const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
// const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// // ========== State ==========
// let allCarts = [];
// let currentDeleteCartId = null;

// // ========== Toast ==========
// function showToast(message, type = 'info') {
//     let toastContainer = document.getElementById('toastContainer');
//     if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.id = 'toastContainer';
//         toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
//         document.body.appendChild(toastContainer);
//     }

//     const toast = document.createElement('div');
//     const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500', warning: 'bg-yellow-500' };
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

// // ========== Fetch helper ==========
// async function fetchAPI(url, options = {}) {
//     const defaultHeaders = {
//         'Authorization': `Bearer ${authToken}`,
//         'Content-Type': 'application/json'
//     };
//     try {
//         const response = await fetch(url, {
//             ...options,
//             headers: { ...defaultHeaders, ...options.headers }
//         });
//         const text = await response.text();
//         let parsed;
//         try { parsed = JSON.parse(text); } catch (e) { parsed = {}; }
//         return parsed;
//     } catch (error) {
//         console.error(`Error fetching ${url}:`, error);
//         return null;
//     }
// }

// // ========== Load Carts ==========
// async function loadCarts() {
//     if (!cartsTableBody) return;

//     cartsTableBody.innerHTML = `
//         <tr>
//             <td colspan="6" class="px-3 md:px-6 py-8 text-center text-gray-500">
//                 <i class="fas fa-spinner fa-spin text-2xl"></i>
//                 <p class="mt-2">Loading carts...</p>
//             </td>
//         </tr>
//     `;

//     // Step 1: Get all users for this merchant
//     const usersData = await fetchAPI(`${API_BASE}/users?merchant_id=${merchantId}`);
//     console.log('Users response:', usersData);

//     let users = [];
//     if (Array.isArray(usersData)) {
//         users = usersData;
//     } else if (usersData && Array.isArray(usersData.data)) {
//         users = usersData.data;
//     }

//     console.log('Total users found:', users.length);

//     if (users.length === 0) {
//         allCarts = [];
//         calculateStats();
//         displayCarts([]);
//         return;
//     }

//     // Step 2: Fetch cart for each user
//     allCarts = [];
//     for (let i = 0; i < users.length; i++) {
//         const user = users[i];
//         const cartData = await fetchAPI(`${API_BASE}/carts?user_id=${user._id || user.id}`);
//         console.log(`Cart for user ${user._id || user.id} (${user.first_name}):`, cartData);

//         if (!cartData || cartData.type === 'EMPTY_CART') continue;

//         let items = [];
//         if (Array.isArray(cartData)) {
//             items = cartData;
//         } else if (Array.isArray(cartData.data)) {
//             items = cartData.data;
//         } else if (cartData.data && Array.isArray(cartData.data.items)) {
//             items = cartData.data.items;
//         } else if (cartData.data && typeof cartData.data === 'object') {
//             // Sometimes API wraps items differently — check all keys
//             const keys = Object.keys(cartData.data);
//             for (let k = 0; k < keys.length; k++) {
//                 if (Array.isArray(cartData.data[keys[k]])) {
//                     items = cartData.data[keys[k]];
//                     break;
//                 }
//             }
//         }

//         if (items.length === 0) continue;

//         allCarts.push({
//             id: user._id || user.id,
//             user_id: user._id || user.id,
//             user_name: (user.first_name || '') + ' ' + (user.last_name || ''),
//             user_email: user.email || '',
//             items: items,
//             updated_at: cartData.updated_at || null
//         });
//     }

//     console.log('Total carts with items:', allCarts.length);
//     calculateStats();
//     displayCarts(allCarts);
// }

// // ========== Calculate Statistics ==========
// function calculateStats() {
//     if (totalCartsEl) totalCartsEl.textContent = allCarts.length;

//     let totalItems = 0;
//     let totalValue = 0;
//     const uniqueUsers = new Set();

//     allCarts.forEach(cart => {
//         totalItems += cart.items.length;
//         cart.items.forEach(item => {
//             const price = Number(item.price || item.product_price || 0);
//             const quantity = Number(item.quantity || 1);
//             totalValue += price * quantity;
//         });
//         uniqueUsers.add(cart.user_id);
//     });

//     if (totalItemsEl) totalItemsEl.textContent = totalItems;
//     if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
//     if (uniqueUsersEl) uniqueUsersEl.textContent = uniqueUsers.size;
// }

// // ========== Display Carts ==========
// function displayCarts(carts) {
//     if (!cartsTableBody) return;

//     if (carts.length === 0) {
//         cartsTableBody.innerHTML = `
//             <tr>
//                 <td colspan="6" class="px-3 md:px-6 py-8 text-center text-gray-500">
//                     <i class="fas fa-shopping-cart text-3xl mb-2"></i>
//                     <p>No active carts found</p>
//                 </td>
//             </tr>
//         `;
//         return;
//     }

//     cartsTableBody.innerHTML = carts.map(cart => {
//         const total = cart.items.reduce((sum, item) => {
//             const price = Number(item.price || item.product_price || 0);
//             const quantity = Number(item.quantity || 1);
//             return sum + (price * quantity);
//         }, 0);

//         const itemsJson = JSON.stringify(cart.items).replace(/'/g, '&#39;').replace(/"/g, '&quot;');

//         return `
//             <tr class="hover:bg-gray-50 transition">
//                 <td class="px-3 md:px-6 py-3 md:py-4">
//                     <div class="text-sm font-medium text-gray-900">${escapeHtml(cart.user_name)}</div>
//                     <div class="text-xs text-gray-500">${escapeHtml(cart.user_email)}</div>
//                 </td>
//                 <td class="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-500">${cart.items.length}</td>
//                 <td class="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-blue-600">$${total.toFixed(2)}</td>
//                 <td class="px-3 md:px-6 py-3 md:py-4">
//                     <div class="flex flex-wrap gap-1">
//                         ${cart.items.slice(0, 2).map(item => `
//                             <span class="px-2 py-1 text-xs bg-gray-100 rounded-full">
//                                 ${escapeHtml(item.name || item.product_name || item.title || 'Product')}
//                             </span>
//                         `).join('')}
//                         ${cart.items.length > 2 ? `<span class="px-2 py-1 text-xs bg-gray-100 rounded-full">+${cart.items.length - 2}</span>` : ''}
//                     </div>
//                 </td>
//                 <td class="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-500">${formatDate(cart.updated_at)}</td>
//                 <td class="px-3 md:px-6 py-3 md:py-4">
//                     <div class="flex gap-2">
//                         <button onclick="viewCartItems('${cart.id}', '${itemsJson}')"
//                             class="text-blue-600 hover:text-blue-800 transition" title="View Items">
//                             <i class="fas fa-eye"></i>
//                         </button>
//                         <button onclick="openDeleteModal('${cart.id}')"
//                             class="text-red-600 hover:text-red-800 transition" title="Clear Cart">
//                             <i class="fas fa-trash-alt"></i>
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//         `;
//     }).join('');
// }

// // ========== View Cart Items Modal ==========
// window.viewCartItems = function (cartId, itemsJson) {
//     let items;
//     try {
//         items = JSON.parse(itemsJson.replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
//     } catch (e) {
//         const cart = allCarts.find(c => String(c.id) === String(cartId));
//         items = cart ? cart.items : [];
//     }

//     let total = 0;
//     if (!cartItemsList) return;

//     if (items.length === 0) {
//         cartItemsList.innerHTML = '<p class="text-center text-gray-500 py-4">No items in this cart</p>';
//     } else {
//         cartItemsList.innerHTML = items.map(item => {
//             const name = item.name || item.product_name || item.title || 'Product';
//             const price = Number(item.price || item.product_price || 0);
//             const quantity = Number(item.quantity || 1);
//             const subtotal = price * quantity;
//             total += subtotal;

//             return `
//                 <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
//                     <div class="flex-1">
//                         <p class="font-medium text-gray-800">${escapeHtml(name)}</p>
//                         <p class="text-sm text-gray-500">Qty: ${quantity}${item.size ? ' | Size: ' + item.size : ''}</p>
//                     </div>
//                     <div class="text-right">
//                         <p class="font-semibold text-blue-600">$${price.toFixed(2)}</p>
//                         <p class="text-xs text-gray-400">Subtotal: $${subtotal.toFixed(2)}</p>
//                     </div>
//                 </div>
//             `;
//         }).join('');
//     }

//     if (modalTotal) modalTotal.textContent = `$${total.toFixed(2)}`;
//     if (cartItemsModal) {
//         cartItemsModal.classList.remove('hidden');
//         cartItemsModal.classList.add('flex');
//     }
// };

// function closeCartModal() {
//     if (cartItemsModal) {
//         cartItemsModal.classList.add('hidden');
//         cartItemsModal.classList.remove('flex');
//     }
// }

// // ========== Delete Cart ==========
// function openDeleteModal(cartId) {
//     currentDeleteCartId = cartId;
//     if (deleteModal) {
//         deleteModal.classList.remove('hidden');
//         deleteModal.classList.add('flex');
//     }
// }

// function closeDeleteModal() {
//     if (deleteModal) {
//         deleteModal.classList.add('hidden');
//         deleteModal.classList.remove('flex');
//     }
//     currentDeleteCartId = null;
// }

// async function clearCart(userId) {
//     const response = await fetchAPI(`${API_BASE}/carts`, {
//         method: 'DELETE',
//         body: JSON.stringify({ user_id: userId })
//     });

//     if (response !== null) {
//         showToast('Cart cleared successfully!', 'success');
//         await loadCarts();
//         return true;
//     }

//     showToast('Failed to clear cart', 'error');
//     return false;
// }

// // ========== Search ==========
// function searchCarts() {
//     if (!searchInput) return;
//     const searchTerm = searchInput.value.toLowerCase().trim();
//     if (!searchTerm) { displayCarts(allCarts); return; }

//     const filtered = allCarts.filter(cart => {
//         const userName = cart.user_name.toLowerCase();
//         const email = cart.user_email.toLowerCase();
//         const productNames = cart.items.map(i => (i.name || i.product_name || i.title || '').toLowerCase()).join(' ');
//         return userName.includes(searchTerm) || email.includes(searchTerm) || productNames.includes(searchTerm);
//     });

//     displayCarts(filtered);
// }

// // ========== Helpers ==========
// function formatDate(dateString) {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     if (isNaN(date)) return 'N/A';
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
// }

// function escapeHtml(str) {
//     if (!str) return '';
//     return String(str)
//         .replace(/&/g, '&amp;')
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;');
// }

// // ========== Event Listeners ==========
// if (searchInput) searchInput.addEventListener('input', searchCarts);
// if (closeCartModalBtn) closeCartModalBtn.addEventListener('click', closeCartModal);
// if (closeModalBtn) closeModalBtn.addEventListener('click', closeCartModal);
// if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
// if (confirmDeleteBtn) {
//     confirmDeleteBtn.addEventListener('click', async () => {
//         if (currentDeleteCartId) {
//             await clearCart(currentDeleteCartId);
//             closeDeleteModal();
//         }
//     });
// }

// if (cartItemsModal) cartItemsModal.addEventListener('click', e => { if (e.target === cartItemsModal) closeCartModal(); });
// if (deleteModal) deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });

// // ========== Sign Out ==========
// const signOutBtn = document.getElementById('signOutBtn');
// if (signOutBtn) {
//     signOutBtn.addEventListener('click', e => {
//         e.preventDefault();
//         localStorage.removeItem('merchantId');
//         localStorage.removeItem('authToken');
//         showToast('Signed out successfully', 'success');
//         setTimeout(() => { window.location.href = 'loginadmin.html'; }, 500);
//     });
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

// // ========== Initialize ==========
// loadCarts();







// ========== Configuration ==========









const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';
const merchantId = '69c2565d1595cbe8104544cb';
const authToken = localStorage.getItem('authToken');

if (!authToken) {
    showToast('Please log in first', 'error');
    setTimeout(() => {
        window.location.href = 'loginadmin.html';
    }, 1500);
}

// ========== DOM Elements ==========
const cartsTableBody = document.getElementById('cartsTableBody');
const searchInput = document.getElementById('searchInput');
const totalCartsEl = document.getElementById('totalCarts');
const totalItemsEl = document.getElementById('totalItems');
const totalValueEl = document.getElementById('totalValue');
const uniqueUsersEl = document.getElementById('uniqueUsers');

const cartItemsModal = document.getElementById('cartItemsModal');
const closeCartModalBtn = document.getElementById('closeCartModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cartItemsList = document.getElementById('cartItemsList');
const modalTotal = document.getElementById('modalTotal');

const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// ========== State ==========
let allCarts = [];
let currentDeleteCartId = null;

// ========== Toast ==========
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500', warning: 'bg-yellow-500' };
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

// ========== Fetch helper ==========
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
        const text = await response.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch (e) { parsed = {}; }
        return parsed;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

// ========== Load Carts ==========
async function loadCarts() {
    if (!cartsTableBody) return;

    cartsTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="px-3 md:px-6 py-8 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin text-2xl"></i>
                <p class="mt-2">Loading carts...</p>
            </td>
        </tr>
    `;

    // Step 1: Get all users for this merchant
    const usersData = await fetchAPI(`${API_BASE}/users?merchant_id=${merchantId}`);
    console.log('Users response:', usersData);

    let users = [];
    if (Array.isArray(usersData)) {
        users = usersData;
    } else if (usersData && Array.isArray(usersData.data)) {
        users = usersData.data;
    }

    console.log('Total users found:', users.length);

    if (users.length === 0) {
        allCarts = [];
        calculateStats();
        displayCarts([]);
        return;
    }

    // Step 2: Fetch cart for each user
    allCarts = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const cartData = await fetchAPI(`${API_BASE}/carts?user_id=${user._id || user.id}`);
        console.log(`Cart for user ${user._id || user.id} (${user.first_name}):`, cartData);

        if (!cartData || cartData.type === 'EMPTY_CART') continue;

        // API returns array: [{id, amount, quantity, products: [{...}]}]
        let rawItems = [];
        if (Array.isArray(cartData)) {
            rawItems = cartData;
        } else if (Array.isArray(cartData.data)) {
            rawItems = cartData.data;
        }

        if (rawItems.length === 0) continue;

        let items = [];
        for (let j = 0; j < rawItems.length; j++) {
            let raw = rawItems[j];
            let productObj = (raw.products && raw.products.length > 0) ? raw.products[0] : null;
            items.push({
                id: (productObj && productObj.id) || raw.product_id || raw.id,
                name: (productObj && productObj.title) || raw.name || 'Product',
                price: Number((productObj && productObj.price) || raw.amount || 0),
                quantity: raw.quantity || 1,
                size: raw.size || 'N/A',
                image: (productObj && productObj.images && productObj.images[0]) || ''
            });
        }

        if (items.length === 0) continue;

        allCarts.push({
            id: user._id || user.id,
            user_id: user._id || user.id,
            user_name: (user.first_name || '') + ' ' + (user.last_name || ''),
            user_email: user.email || '',
            items: items,
            updated_at: cartData.updated_at || null
        });
    }

    console.log('Total carts with items:', allCarts.length);
    calculateStats();
    displayCarts(allCarts);
}

// ========== Calculate Statistics ==========
function calculateStats() {
    if (totalCartsEl) totalCartsEl.textContent = allCarts.length;

    let totalItems = 0;
    let totalValue = 0;
    const uniqueUsers = new Set();

    allCarts.forEach(cart => {
        totalItems += cart.items.length;
        cart.items.forEach(item => {
            const price = Number(item.price || item.product_price || 0);
            const quantity = Number(item.quantity || 1);
            totalValue += price * quantity;
        });
        uniqueUsers.add(cart.user_id);
    });

    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
    if (uniqueUsersEl) uniqueUsersEl.textContent = uniqueUsers.size;
}

// ========== Display Carts ==========
function displayCarts(carts) {
    if (!cartsTableBody) return;

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
        const total = cart.items.reduce((sum, item) => {
            const price = Number(item.price || item.product_price || 0);
            const quantity = Number(item.quantity || 1);
            return sum + (price * quantity);
        }, 0);

        const itemsJson = JSON.stringify(cart.items).replace(/'/g, '&#39;').replace(/"/g, '&quot;');

        return `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-3 md:px-6 py-3 md:py-4">
                    <div class="text-sm font-medium text-gray-900">${escapeHtml(cart.user_name)}</div>
                    <div class="text-xs text-gray-500">${escapeHtml(cart.user_email)}</div>
                </td>
                <td class="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-500">${cart.items.length}</td>
                <td class="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-blue-600">$${total.toFixed(2)}</td>
                <td class="px-3 md:px-6 py-3 md:py-4">
                    <div class="flex flex-wrap gap-1">
                        ${cart.items.slice(0, 2).map(item => `
                            <span class="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                ${escapeHtml(item.name || item.product_name || item.title || 'Product')}
                            </span>
                        `).join('')}
                        ${cart.items.length > 2 ? `<span class="px-2 py-1 text-xs bg-gray-100 rounded-full">+${cart.items.length - 2}</span>` : ''}
                    </div>
                </td>
                <td class="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-500">${formatDate(cart.updated_at)}</td>
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

// ========== View Cart Items Modal ==========
window.viewCartItems = function (cartId, itemsJson) {
    let items;
    try {
        items = JSON.parse(itemsJson.replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
    } catch (e) {
        const cart = allCarts.find(c => String(c.id) === String(cartId));
        items = cart ? cart.items : [];
    }

    let total = 0;
    if (!cartItemsList) return;

    if (items.length === 0) {
        cartItemsList.innerHTML = '<p class="text-center text-gray-500 py-4">No items in this cart</p>';
    } else {
        cartItemsList.innerHTML = items.map(item => {
            const name = item.name || item.product_name || item.title || 'Product';
            const price = Number(item.price || item.product_price || 0);
            const quantity = Number(item.quantity || 1);
            const subtotal = price * quantity;
            total += subtotal;

            return `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                    <div class="flex-1">
                        <p class="font-medium text-gray-800">${escapeHtml(name)}</p>
                        <p class="text-sm text-gray-500">Qty: ${quantity}${item.size ? ' | Size: ' + item.size : ''}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-blue-600">$${price.toFixed(2)}</p>
                        <p class="text-xs text-gray-400">Subtotal: $${subtotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (modalTotal) modalTotal.textContent = `$${total.toFixed(2)}`;
    if (cartItemsModal) {
        cartItemsModal.classList.remove('hidden');
        cartItemsModal.classList.add('flex');
    }
};

function closeCartModal() {
    if (cartItemsModal) {
        cartItemsModal.classList.add('hidden');
        cartItemsModal.classList.remove('flex');
    }
}

// ========== Delete Cart ==========
function openDeleteModal(cartId) {
    currentDeleteCartId = cartId;
    if (deleteModal) {
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
    }
}

function closeDeleteModal() {
    if (deleteModal) {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
    }
    currentDeleteCartId = null;
}

async function clearCart(userId) {
    const response = await fetchAPI(`${API_BASE}/carts`, {
        method: 'DELETE',
        body: JSON.stringify({ user_id: userId })
    });

    if (response !== null) {
        showToast('Cart cleared successfully!', 'success');
        await loadCarts();
        return true;
    }

    showToast('Failed to clear cart', 'error');
    return false;
}

// ========== Search ==========
function searchCarts() {
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) { displayCarts(allCarts); return; }

    const filtered = allCarts.filter(cart => {
        const userName = cart.user_name.toLowerCase();
        const email = cart.user_email.toLowerCase();
        const productNames = cart.items.map(i => (i.name || i.product_name || i.title || '').toLowerCase()).join(' ');
        return userName.includes(searchTerm) || email.includes(searchTerm) || productNames.includes(searchTerm);
    });

    displayCarts(filtered);
}

// ========== Helpers ==========
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ========== Event Listeners ==========
if (searchInput) searchInput.addEventListener('input', searchCarts);
if (closeCartModalBtn) closeCartModalBtn.addEventListener('click', closeCartModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeCartModal);
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (currentDeleteCartId) {
            await clearCart(currentDeleteCartId);
            closeDeleteModal();
        }
    });
}

if (cartItemsModal) cartItemsModal.addEventListener('click', e => { if (e.target === cartItemsModal) closeCartModal(); });
if (deleteModal) deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });

// ========== Sign Out ==========
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('merchantId');
        localStorage.removeItem('authToken');
        showToast('Signed out successfully', 'success');
        setTimeout(() => { window.location.href = 'loginadmin.html'; }, 500);
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
