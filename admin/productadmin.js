
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
const productGrid = document.getElementById('productGrid');
const filterMyProductsBtn = document.getElementById('filterMyProductsBtn');
const showAllBtn = document.getElementById('showAllBtn');
const signOutBtn = document.getElementById('signOutBtn');
const activeFilterIndicator = document.getElementById('activeFilterIndicator');
const filterCategoryName = document.getElementById('filterCategoryName');
const clearFilterBtn = document.getElementById('clearFilterBtn');

// Edit Modal
const editModal = document.getElementById('editModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editForm = document.getElementById('editProductForm');
const editProductId = document.getElementById('editProductId');
const editTitle = document.getElementById('editTitle');
const editPrice = document.getElementById('editPrice');
const editQuantity = document.getElementById('editQuantity');

// Category Modal
const categoryModal = document.getElementById('categorySelectionModal');
const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
const cancelCategoryModalBtn = document.getElementById('cancelCategoryModalBtn');
const categoryListModal = document.getElementById('categoryListModal');

// State
let allCategories = [];
let selectedCategoryId = null;
let selectedCategoryName = null;
let currentFilter = 'all';

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

const icons = {
success: 'fa-check-circle',
error: 'fa-exclamation-circle',
info: 'fa-info-circle',
warning: 'fa-exclamation-triangle'
};

toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
toast.style.animation = 'slideInRight 0.3s ease-out';
toast.innerHTML = `
<i class="fas ${icons[type]}"></i>
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
showToast(`Error: ${error.message}`, 'error');
return null;
}
}

// ========== Fetch categories ==========
async function fetchCategories() {
const data = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`);
let categories = [];
if (Array.isArray(data)) categories = data;
else if (data && data.data && Array.isArray(data.data)) categories = data.data;
allCategories = categories;
return categories;
}

// ========== Fetch products ==========
async function fetchProducts() {
const response = await fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}`);
let products = [];
if (Array.isArray(response)) products = response;
else if (response && response.data && Array.isArray(response.data)) products = response.data;
return products;
}

// ========== Confirmation Modal ==========
function showConfirmation(title, message, onConfirm) {
const modalDiv = document.createElement('div');
modalDiv.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
modalDiv.innerHTML = `
<div class="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
<h3 class="text-lg font-semibold mb-2">${title}</h3>
<p class="text-gray-600 mb-6">${message}</p>
<div class="flex justify-end gap-3">
<button id="confirmNo" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
<button id="confirmYes" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
</div>
</div>
`;
document.body.appendChild(modalDiv);

const handleNo = () => modalDiv.remove();
const handleYes = () => {
modalDiv.remove();
onConfirm();
};

document.getElementById('confirmNo').addEventListener('click', handleNo);
document.getElementById('confirmYes').addEventListener('click', handleYes);
}

// ========== Render products ==========
function renderProducts(products) {
if (!products.length) {
productGrid.innerHTML = `
<div class="col-span-full text-center py-10">
<i class="fas fa-box-open text-4xl text-gray-400"></i>
<p class="text-gray-500 mt-2">No products found.</p>
<a href="./createproduct.html" class="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
Create your first product
</a>
</div>
`;
return;
}

productGrid.innerHTML = products.map(product => {
const category = allCategories.find(c => String(c.id) === String(product.category_id));
const categoryName = category ? category.name : 'Uncategorized';
const imageUrl = product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200?text=Product';

return `
<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
<img src="${imageUrl}" alt="${escapeHtml(product.title)}" class="w-full h-48 object-cover">
<div class="p-4">
<h3 class="text-lg font-semibold">${escapeHtml(product.title)}</h3>
<p class="text-blue-600 font-bold mt-1">₦${Number(product.price).toFixed(2)}</p>
<p class="text-sm text-gray-500 mt-1">
<i class="fas fa-tag mr-1"></i>${escapeHtml(categoryName)}
</p>
<p class="text-sm text-gray-500">
<i class="fas fa-boxes mr-1"></i>Stock: ${product.quantity || 0}
</p>
<div class="mt-4 flex gap-2">
<button class="edit-btn flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
data-id="${product.id}" data-title="${escapeHtml(product.title)}"
data-price="${product.price}" data-quantity="${product.quantity || 0}">
<i class="fas fa-edit"></i> Edit
</button>
<button class="delete-btn flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
data-id="${product.id}" data-title="${escapeHtml(product.title)}">
<i class="fas fa-trash"></i> Delete
</button>
</div>
</div>
</div>
`;
}).join('');

// Edit buttons
document.querySelectorAll('.edit-btn').forEach(btn => {
btn.addEventListener('click', () => {
editProductId.value = btn.dataset.id;
editTitle.value = btn.dataset.title;
editPrice.value = btn.dataset.price;
editQuantity.value = btn.dataset.quantity;
editModal.classList.remove('hidden');
editModal.classList.add('flex');
});
});

// Delete buttons
document.querySelectorAll('.delete-btn').forEach(btn => {
btn.addEventListener('click', async () => {
const productId = btn.dataset.id;
const productTitle = btn.dataset.title;

showConfirmation('Delete Product', `Are you sure you want to delete "${productTitle}"?`, async () => {
await fetchAPI(`${API_BASE}/products/${productId}`, { method: 'DELETE' });
showToast(`✅ "${productTitle}" deleted successfully!`, 'success');
loadProducts(currentFilter);
});
});
});
}

// ========== Load products with filter ==========
async function loadProducts(filter = currentFilter) {
productGrid.innerHTML = '<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-4xl"></i><p>Loading...</p></div>';

await fetchCategories();
const products = await fetchProducts();

let displayProducts = products;
if (filter === 'my' && selectedCategoryId) {
displayProducts = products.filter(p => String(p.category_id) === String(selectedCategoryId));
if (filterCategoryName) filterCategoryName.textContent = selectedCategoryName;
if (activeFilterIndicator) activeFilterIndicator.classList.remove('hidden');
} else {
if (activeFilterIndicator) activeFilterIndicator.classList.add('hidden');
}

renderProducts(displayProducts);
}

// ========== Edit submit ==========
editForm.addEventListener('submit', async (e) => {
e.preventDefault();
const updatedData = {
title: editTitle.value.trim(),
price: parseFloat(editPrice.value),
quantity: parseInt(editQuantity.value, 10)
};
await fetchAPI(`${API_BASE}/products/${editProductId.value}`, {
method: 'PUT',
body: JSON.stringify(updatedData)
});
showToast('✅ Product updated successfully!', 'success');
editModal.classList.add('hidden');
editModal.classList.remove('flex');
loadProducts(currentFilter);
});

// ========== Category modal ==========
async function openCategoryModal() {
const categories = await fetchCategories();
if (categories.length === 0) {
showToast('No categories found. Create one first.', 'warning');
setTimeout(() => {
window.location.href = 'createcategory.html';
}, 1500);
return;
}

categoryListModal.innerHTML = categories.map(cat => `
<button class="select-cat-btn w-full text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition mb-2"
data-id="${cat.id}" data-name="${cat.name}">
<i class="fas fa-folder text-blue-500 mr-2"></i>${escapeHtml(cat.name)}
</button>
`).join('');

document.querySelectorAll('.select-cat-btn').forEach(btn => {
btn.addEventListener('click', () => {
selectedCategoryId = btn.dataset.id;
selectedCategoryName = btn.dataset.name;
currentFilter = 'my';
closeCategoryModal();
loadProducts('my');
showToast(`Showing products in "${selectedCategoryName}" category`, 'success');
});
});

categoryModal.classList.remove('hidden');
categoryModal.classList.add('flex');
}

function closeCategoryModal() {
categoryModal.classList.add('hidden');
categoryModal.classList.remove('flex');
}

// ========== Event listeners ==========
filterMyProductsBtn.addEventListener('click', async () => {
const categories = await fetchCategories();
if (categories.length === 0) {
showToast('No categories found. Create a category first.', 'warning');
setTimeout(() => {
window.location.href = 'createcategory.html';
}, 1500);
} else if (selectedCategoryId) {
currentFilter = 'my';
loadProducts('my');
showToast(`Showing products in "${selectedCategoryName}"`, 'info');
} else {
openCategoryModal();
}
});

showAllBtn.addEventListener('click', () => {
selectedCategoryId = null;
selectedCategoryName = null;
currentFilter = 'all';
loadProducts('all');
showToast('Showing all products', 'info');
});

clearFilterBtn.addEventListener('click', () => {
selectedCategoryId = null;
selectedCategoryName = null;
currentFilter = 'all';
loadProducts('all');
showToast('Filter cleared', 'info');
});

closeEditModalBtn.addEventListener('click', () => {
editModal.classList.add('hidden');
editModal.classList.remove('flex');
});
cancelEditBtn.addEventListener('click', () => {
editModal.classList.add('hidden');
editModal.classList.remove('flex');
});
closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
cancelCategoryModalBtn.addEventListener('click', closeCategoryModal);

signOutBtn.addEventListener('click', (e) => {
e.preventDefault();
localStorage.removeItem('merchantId');
localStorage.removeItem('authToken');
showToast('Signed out successfully', 'success');
setTimeout(() => {
window.location.href = 'loginadmin.html';
}, 500);
});

function escapeHtml(str) {
if (!str) return '';
return str.replace(/[&<>]/g, function(m) {
if (m === '&') return '&amp;';
if (m === '<') return '&lt;';
if (m === '>') return '&gt;';
return m;
});
}

// CSS animations
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

// Initialize
loadProducts('all');
