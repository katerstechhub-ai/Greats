// ========== DOM Elements ==========
const totalProductsEl = document.getElementById('totalProducts');
const totalSalesEl = document.getElementById('totalUsers');       // repurposed as "Total Sales"
const totalItemsSoldEl = document.getElementById('totalCartItems'); // repurposed as "Total Items Sold"
const productTableBody = document.getElementById('productTableBody');

// ========== API Configuration ==========
const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

const merchantId = localStorage.getItem('merchantId');
const authToken = localStorage.getItem('authToken');

if (!merchantId || !authToken) {
    alert('Please log in first');
    window.location.href = 'login.html';
}

// ========== Helper: fetch with auth ==========
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

// ========== Helper: extract array from API response ==========
function extractDataArray(response, defaultValue = []) {
    if (!response) return defaultValue;
    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.products && Array.isArray(response.products)) return response.products;
    if (response.sales && Array.isArray(response.sales)) return response.sales;
    return defaultValue;
}

// ========== Fetch all categories to create name lookup ==========
async function fetchCategoryMap() {
    const categoriesResponse = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`, 'categories');
    const categories = extractDataArray(categoriesResponse);
    const categoryMap = {};
    categories.forEach(cat => {
        categoryMap[cat.id] = cat.name;
    });
    console.log('Category map:', categoryMap);
    return categoryMap;
}

// ========== Load card statistics ==========
async function loadStats() {
    try {
        // 1. Total products
        const productsResponse = await fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}`, 'products');
        const productsArray = extractDataArray(productsResponse);
        const totalProducts = productsArray.length;
        if (totalProductsEl) totalProductsEl.textContent = totalProducts;
        console.log('Total products:', totalProducts);

        // 2. Sales data – adjust endpoint as needed
        let salesArray = [];
        let salesResponse = await fetchAPI(`${API_BASE}/sales?merchant_id=${merchantId}`, 'sales');
        if (!salesResponse) {
            salesResponse = await fetchAPI(`${API_BASE}/orders?merchant_id=${merchantId}`, 'orders');
        }
        salesArray = extractDataArray(salesResponse);
        
        const totalSales = salesArray.length;
        const totalItemsSold = salesArray.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        if (totalSalesEl) totalSalesEl.textContent = totalSales;
        if (totalItemsSoldEl) totalItemsSoldEl.textContent = totalItemsSold;
        console.log('Total sales:', totalSales, 'Items sold:', totalItemsSold);
    } catch (error) {
        console.error('Error loading stats:', error);
        if (totalProductsEl) totalProductsEl.textContent = 'Error';
        if (totalSalesEl) totalSalesEl.textContent = 'Error';
        if (totalItemsSoldEl) totalItemsSoldEl.textContent = 'Error';
    }
}

// ========== Load product table with category names ==========
async function loadProducts() {
    try {
        // Fetch both categories and products in parallel
        const [categoryMap, productsResponse] = await Promise.all([
            fetchCategoryMap(),
            fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}`, 'products list')
        ]);
        
        const productList = extractDataArray(productsResponse).slice(0, 10);

        if (!productTableBody) return;

        if (productList.length === 0) {
            productTableBody.innerHTML = `
                 <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No products available.
                     </td>
                 </tr>
            `;
            return;
        }

      // Build table rows with category names
        productTableBody.innerHTML = productList.map((product, index) => {
            const status = product.quantity > 0 ? 'In Stock' : 'Out of Stock';
            // Convert product.category_id to string for lookup
            const catId = product.category_id !== undefined ? String(product.category_id) : null;
            const categoryName = catId && categoryMap[catId] 
                ? categoryMap[catId] 
                : (product.category_name || 'N/A');
            
            // Debug log for each product
            console.log(`Product: ${product.title}, category_id: ${product.category_id} (type: ${typeof product.category_id}), categoryName: ${categoryName}`);
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${index + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${escapeHtml(product.title)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatPrice(product.price)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escapeHtml(categoryName)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.quantity || 0}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                    <td colspan="6" class="px-6 py-4 text-center text-red-500">
                        Failed to load products. Check console.
                     </td>
                 </tr>
            `;
        }
    }
}

// ========== Helper: format price ==========
function formatPrice(price) {
    if (price === undefined || price === null) return 'N/A';
    const num = parseFloat(price);
    return isNaN(num) ? price : `$${num.toFixed(2)}`;
}

// ========== Helper: escape HTML ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== Initialize ==========
loadStats();
loadProducts();