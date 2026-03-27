// DOM Elements
const totalProductsEl = document.getElementById('totalProducts');
const totalUsersEl = document.getElementById('totalUsers');
const totalCartItemsEl = document.getElementById('totalCartItems');
const productTableBody = document.getElementById('productTableBody');

//API Configuration 
const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

const merchantId = localStorage.getItem('merchantId');
const authToken = localStorage.getItem('authToken');

if (!merchantId || !authToken) {
    showToast('Please log in first', 'error');
    setTimeout(() => {
        window.location.href = 'loginadmin.html';
    }, 1500);
}

//  Toast Notification
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

//  Helper: fetch with auth 
async function fetchAPI(url, errorContext = 'API call') {
    try {
        console.log(`Fetching: ${url}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log(`Response from ${errorContext}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching ${errorContext}:`, error);
        return null;
    }
}

//  Helper: extract array from API response 
// Also reads total count from common pagination fields
function extractDataArray(response, defaultValue = []) {
    if (!response) return defaultValue;
    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.products && Array.isArray(response.products)) return response.products;
    if (response.sales && Array.isArray(response.sales)) return response.sales;
    if (response.users && Array.isArray(response.users)) return response.users;
    return defaultValue;
}

// Pull the true total from pagination metadata if available,
// otherwise fall back to the length of the returned array.
function extractTotalCount(response, fallbackArray) {
    if (!response) return fallbackArray.length;

    // Common pagination fields APIs use
    if (typeof response.total === 'number') return response.total;
    if (typeof response.count === 'number') return response.count;
    if (typeof response.total_count === 'number') return response.total_count;
    if (response.meta && typeof response.meta.total === 'number') return response.meta.total;
    if (response.pagination && typeof response.pagination.total === 'number') return response.pagination.total;

    // No pagination info — the array itself is the full result
    return fallbackArray.length;
}

//  Fetch all categories to create name lookup 
async function fetchCategoryMap() {
    const categoriesResponse = await fetchAPI(
        `${API_BASE}/categories?merchant_id=${merchantId}`,
        'categories'
    );
    const categories = extractDataArray(categoriesResponse);
    const categoryMap = {};

    categories.forEach(cat => {
        // Store under BOTH string and number keys so any comparison works
        categoryMap[String(cat.id)] = cat.name;
        categoryMap[Number(cat.id)] = cat.name;
    });

    console.log('Category map:', categoryMap);
    return categoryMap;
}

//  Load card statistics 
async function loadStats() {
    try {
        // 1. Total products — use pagination total if available, not array length
        const productsResponse = await fetchAPI(
            `${API_BASE}/products?merchant_id=${merchantId}`,
            'products'
        );
        const productsArray = extractDataArray(productsResponse);
        const totalProducts = extractTotalCount(productsResponse, productsArray);
        if (totalProductsEl) totalProductsEl.textContent = totalProducts;
        console.log('Total products:', totalProducts);

        // 2. Total users
        const usersResponse = await fetchAPI(
            `${API_BASE}/users?merchant_id=${merchantId}`,
            'users'
        );
        const usersArray = extractDataArray(usersResponse);
        const totalUsers = extractTotalCount(usersResponse, usersArray);
        if (totalUsersEl) totalUsersEl.textContent = totalUsers;
        console.log('Total users:', totalUsers);

        // 3. Total cart items
        let totalCartItems = 0;
        const cartResponse = await fetchAPI(
            `${API_BASE}/carts?merchant_id=${merchantId}`,
            'carts'
        );
        if (cartResponse) {
            const cartArray = extractDataArray(cartResponse);
            totalCartItems = cartArray.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
        if (totalCartItemsEl) totalCartItemsEl.textContent = totalCartItems;
        console.log('Total cart items:', totalCartItems);

    } catch (error) {
        console.error('Error loading stats:', error);
        if (totalProductsEl) totalProductsEl.textContent = 'Error';
        if (totalUsersEl) totalUsersEl.textContent = 'Error';
        if (totalCartItemsEl) totalCartItemsEl.textContent = 'Error';
        showToast('Error loading dashboard data', 'error');
    }
}

//  Load product table with category names 
async function loadProducts() {
    try {
        const [categoryMap, productsResponse] = await Promise.all([
            fetchCategoryMap(),
            fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}`, 'products list')
        ]);

        // Show all products in the table — no slice limit
        const productList = extractDataArray(productsResponse);

        if (!productTableBody) return;

        if (productList.length === 0) {
            productTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-3 md:px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-box-open text-3xl mb-2"></i>
                        <p>No products available</p>
                        <a href="./createproduct.html" class="inline-block mt-2 text-blue-600 hover:text-blue-700">Create your first product</a>
                    </td>
                </tr>
            `;
            return;
        }

        productTableBody.innerHTML = productList.map((product, index) => {
            const status = product.quantity > 0 ? 'In Stock' : 'Out of Stock';

            // category_id can arrive as a number or string — look up both
            const catId = product.category_id;
            const categoryName = (catId !== undefined && catId !== null && categoryMap[catId])
                ? categoryMap[catId]
                : (product.category_name || 'N/A');

            return `
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">${index + 1}</td>
                    <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">${escapeHtml(product.title)}</td>
                    <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">${formatPrice(product.price)}</td>
                    <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">${escapeHtml(categoryName)}</td>
                    <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">${product.quantity || 0}</td>
                    <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${status}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        if (productTableBody) {
            productTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-3 md:px-6 py-8 text-center text-red-500">
                        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                        <p>Failed to load products</p>
                    </td>
                </tr>
            `;
        }
        showToast('Error loading products', 'error');
    }
}

// Helper: format price
function formatPrice(price) {
    if (price === undefined || price === null) return 'N/A';
    const num = parseFloat(price);
    return isNaN(num) ? price : `$${num.toFixed(2)}`;
}

//  Helper: escape HTML 
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Sign Out 
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

// ========== Initialize ==========
loadStats();
loadProducts();