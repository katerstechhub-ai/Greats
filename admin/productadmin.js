
// const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

// const merchantId = localStorage.getItem('merchantId');
// const authToken = localStorage.getItem('authToken');

// if (!merchantId || !authToken) {
//     showToast('Please log in first', 'error');
//     setTimeout(() => {
//         window.location.href = 'login.html';
//     }, 1500);
// }

// // DOM Elements
// const productGrid = document.getElementById('productGrid');
// const filterMyProductsBtn = document.getElementById('filterMyProductsBtn');
// const showAllBtn = document.getElementById('showAllBtn');
// const signOutBtn = document.getElementById('signOutBtn');
// const activeFilterIndicator = document.getElementById('activeFilterIndicator');
// const filterCategoryNameEl = document.getElementById('filterCategoryName');
// const clearFilterBtn = document.getElementById('clearFilterBtn');

// // Edit Modal
// const editModal = document.getElementById('editModal');
// const closeEditModalBtn = document.getElementById('closeEditModalBtn');
// const cancelEditBtn = document.getElementById('cancelEditBtn');
// const editForm = document.getElementById('editProductForm');
// const editProductId = document.getElementById('editProductId');
// const editTitle = document.getElementById('editTitle');
// const editPrice = document.getElementById('editPrice');
// const editQuantity = document.getElementById('editQuantity');

// // Category Modal
// const categoryModal = document.getElementById('categorySelectionModal');
// const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
// const cancelCategoryModalBtn = document.getElementById('cancelCategoryModalBtn');
// const categoryListModal = document.getElementById('categoryListModal');

// // Main content area (for blur)
// const mainContent = document.querySelector('.col-span-1.md\\:col-span-4');

// // State
// let allCategories = [];
// let allProducts = [];
// let selectedCategoryName = null;

// // ========== Toast ==========
// function showToast(message, type = 'info') {
//     let toastContainer = document.getElementById('toastContainer');
//     if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.id = 'toastContainer';
//         toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
//         document.body.appendChild(toastContainer);
//     }

//     const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500', warning: 'bg-yellow-500' };
//     const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };

//     const toast = document.createElement('div');
//     toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
//     toast.style.animation = 'slideInRight 0.3s ease-out';
//     toast.innerHTML = `
//         <i class="fas ${icons[type]}"></i>
//         <span class="flex-1 text-sm">${message}</span>
//         <button class="toast-close hover:text-gray-200 ml-2"><i class="fas fa-times"></i></button>
//     `;
//     toastContainer.appendChild(toast);

//     const timeout = setTimeout(() => removeToast(toast), 4000);
//     toast.querySelector('.toast-close').addEventListener('click', () => {
//         clearTimeout(timeout);
//         removeToast(toast);
//     });
// }

// function removeToast(toast) {
//     toast.style.animation = 'slideOutRight 0.3s ease-in';
//     setTimeout(() => toast.remove(), 300);
// }

// // ========== Fetch helper ==========
// async function fetchAPI(url, options = {}) {
//     try {
//         const response = await fetch(url, {
//             ...options,
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json',
//                 ...options.headers
//             }
//         });
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         return await response.json();
//     } catch (error) {
//         console.error('fetchAPI error:', error);
//         return null;
//     }
// }

// // ========== Blur helpers ==========
// function blurPage() {
//     document.querySelector('.col-span-1.md\\:col-span-4').style.filter = 'blur(3px)';
//     document.querySelector('.col-span-1.bg-white.border-r').style.filter = 'blur(3px)';
// }

// function unblurPage() {
//     document.querySelector('.col-span-1.md\\:col-span-4').style.filter = '';
//     document.querySelector('.col-span-1.bg-white.border-r').style.filter = '';
// }

// // ========== Load all data ==========
// async function loadData() {
//     productGrid.innerHTML = `
//         <div class="col-span-full text-center py-10">
//             <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
//             <p class="text-gray-500 mt-2">Loading products...</p>
//         </div>`;

//     const catData = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`);
//     allCategories = Array.isArray(catData) ? catData : (catData?.data || []);

//     const prodData = await fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}`);
//     allProducts = Array.isArray(prodData) ? prodData : (prodData?.data || []);

//     selectedCategoryName = null;
//     hideFilterIndicator();
//     displayProducts(allProducts);
// }

// // ========== Load products by category ==========
// async function loadProductsByCategory(categoryId, categoryName) {
//     productGrid.innerHTML = `
//         <div class="col-span-full text-center py-10">
//             <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
//             <p class="text-gray-500 mt-2">Loading...</p>
//         </div>`;

//     const data = await fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}&category_id=${categoryId}`);
//     let fetched = Array.isArray(data) ? data : (data?.data || []);

//     // fallback: client-side filter if API doesn't support category_id param
//     if (fetched.length === 0) {
//         fetched = allProducts.filter(p => String(p.category_id) === String(categoryId));
//     }

//     selectedCategoryName = categoryName;
//     showFilterIndicator(categoryName);
//     displayProducts(fetched);
//     showToast(`Showing "${categoryName}" products`, 'success');
// }

// // ========== Display products ==========
// function displayProducts(products) {
//     if (!products || products.length === 0) {
//         productGrid.innerHTML = `
//             <div class="col-span-full text-center py-10">
//                 <i class="fas fa-box-open text-4xl text-gray-400"></i>
//                 <p class="text-gray-500 mt-2">${selectedCategoryName ? `No products found in "${selectedCategoryName}".` : 'No products found.'}</p>
//                 <a href="./createproduct.html" class="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                     Create a product
//                 </a>
//             </div>`;
//         return;
//     }

//     productGrid.innerHTML = products.map(product => {
//         const category = allCategories.find(c => String(c.id) === String(product.category_id));
//         const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x200?text=Product';

//         return `
//         <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
//             <img src="${imageUrl}" alt="${escapeHtml(product.title)}" class="w-full h-48 object-cover">
//             <div class="p-4">
//                 <h3 class="text-lg font-semibold">${escapeHtml(product.title)}</h3>
//                 <p class="text-black font-semibold mt-1">$${Number(product.price).toFixed(2)}</p>
//                 ${category ? `<p class="text-sm text-gray-500 mt-1"><i class="fas fa-tag mr-1"></i>${escapeHtml(category.name)}</p>` : ''}
//                 <p class="text-sm text-gray-500"><i class="fas fa-boxes mr-1"></i>Stock: ${product.quantity || 0}</p>
//                 <div class="mt-4 flex gap-2">
//                     <button class="edit-btn flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
//                         data-id="${product.id}" data-title="${escapeHtml(product.title)}"
//                         data-price="${product.price}" data-quantity="${product.quantity || 0}">
//                         <i class="fas fa-edit"></i> Edit
//                     </button>
//                     <button class="delete-btn flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
//                         data-id="${product.id}" data-title="${escapeHtml(product.title)}">
//                         <i class="fas fa-trash"></i> Delete
//                     </button>
//                 </div>
//             </div>
//         </div>`;
//     }).join('');

//     attachHandlers();
// }

// // ========== Attach edit/delete handlers ==========
// function attachHandlers() {
//     document.querySelectorAll('.edit-btn').forEach(btn => {
//         btn.addEventListener('click', () => {
//             editProductId.value = btn.dataset.id;
//             editTitle.value = btn.dataset.title;
//             editPrice.value = btn.dataset.price;
//             editQuantity.value = btn.dataset.quantity;
//             openEditModal();
//         });
//     });

//     document.querySelectorAll('.delete-btn').forEach(btn => {
//         btn.addEventListener('click', async () => {
//             if (confirm(`Delete "${btn.dataset.title}"?`)) {
//                 await fetchAPI(`${API_BASE}/products/${btn.dataset.id}`, { method: 'DELETE' });
//                 showToast(`"${btn.dataset.title}" deleted!`, 'success');
//                 await loadData();
//                 if (selectedCategoryName) {
//                     const cat = allCategories.find(c => c.name === selectedCategoryName);
//                     if (cat) loadProductsByCategory(cat.id, cat.name);
//                 }
//             }
//         });
//     });
// }

// // ========== Filter indicator ==========
// function showFilterIndicator(categoryName) {
//     if (filterCategoryNameEl) filterCategoryNameEl.textContent = categoryName;
//     if (activeFilterIndicator) activeFilterIndicator.classList.remove('hidden');
// }

// function hideFilterIndicator() {
//     if (activeFilterIndicator) activeFilterIndicator.classList.add('hidden');
// }

// // ========== Show all ==========
// function showAll() {
//     selectedCategoryName = null;
//     hideFilterIndicator();
//     displayProducts(allProducts);
//     showToast('Showing all products', 'info');
// }

// // ========== Edit modal ==========
// function openEditModal() {
//     editModal.classList.remove('hidden');
//     editModal.classList.add('flex');
//     blurPage();
// }

// function closeEditModal() {
//     editModal.classList.add('hidden');
//     editModal.classList.remove('flex');
//     unblurPage();
// }

// // ========== Category modal ==========
// function openCategoryModal() {
//     if (allCategories.length === 0) {
//         showToast('No categories found. Create one first.', 'warning');
//         return;
//     }

//     categoryListModal.innerHTML = allCategories.map(cat => `
//         <button class="select-cat-btn w-full text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition"
//             data-id="${cat.id}" data-name="${escapeHtml(cat.name)}">
//             <i class="fas fa-folder text-blue-500 mr-2"></i>${escapeHtml(cat.name)}
//         </button>
//     `).join('');

//     document.querySelectorAll('.select-cat-btn').forEach(btn => {
//         btn.addEventListener('click', () => {
//             closeCategoryModal();
//             loadProductsByCategory(btn.dataset.id, btn.dataset.name);
//         });
//     });

//     categoryModal.classList.remove('hidden');
//     categoryModal.classList.add('flex');
//     blurPage();
// }

// function closeCategoryModal() {
//     categoryModal.classList.add('hidden');
//     categoryModal.classList.remove('flex');
//     unblurPage();
// }

// // ========== Edit form submit ==========
// editForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const result = await fetchAPI(`${API_BASE}/products/${editProductId.value}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//             title: editTitle.value.trim(),
//             price: parseFloat(editPrice.value),
//             quantity: parseInt(editQuantity.value, 10)
//         })
//     });
//     if (result) {
//         showToast('Product updated!', 'success');
//         closeEditModal();
//         await loadData();
//         if (selectedCategoryName) {
//             const cat = allCategories.find(c => c.name === selectedCategoryName);
//             if (cat) loadProductsByCategory(cat.id, cat.name);
//         }
//     } else {
//         showToast('Failed to update product', 'error');
//     }
// });

// // ========== Event listeners ==========
// filterMyProductsBtn?.addEventListener('click', openCategoryModal);
// showAllBtn?.addEventListener('click', showAll);
// clearFilterBtn?.addEventListener('click', showAll);
// closeEditModalBtn?.addEventListener('click', closeEditModal);
// cancelEditBtn?.addEventListener('click', closeEditModal);
// closeCategoryModalBtn?.addEventListener('click', closeCategoryModal);
// cancelCategoryModalBtn?.addEventListener('click', closeCategoryModal);

// signOutBtn?.addEventListener('click', (e) => {
//     e.preventDefault();
//     localStorage.clear();
//     showToast('Signed out', 'success');
//     setTimeout(() => window.location.href = 'loginadmin.html', 500);
// });

// // ========== Escape HTML ==========
// function escapeHtml(str) {
//     if (!str) return '';
//     return str.replace(/[&<>]/g, m => {
//         if (m === '&') return '&amp;';
//         if (m === '<') return '&lt;';
//         if (m === '>') return '&gt;';
//         return m;
//     });
// }

// // ========== CSS animations ==========
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
// loadData();





// const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

// const merchantId = localStorage.getItem('merchantId');
// const authToken = localStorage.getItem('authToken');

// if (!merchantId || !authToken) {
// showToast('Please log in first', 'error');
// setTimeout(() => {
// window.location.href = 'login.html';
// }, 1500);

// }

// // DOM Elements
// const productGrid = document.getElementById('productGrid');
// const filterMyProductsBtn = document.getElementById('filterMyProductsBtn');
// const showAllBtn = document.getElementById('showAllBtn');
// const signOutBtn = document.getElementById('signOutBtn');
// const activeFilterIndicator = document.getElementById('activeFilterIndicator');
// const filterCategoryNameEl = document.getElementById('filterCategoryName');
// const clearFilterBtn = document.getElementById('clearFilterBtn');

// // Edit Modal
// const editModal = document.getElementById('editModal');
// const closeEditModalBtn = document.getElementById('closeEditModalBtn');
// const cancelEditBtn = document.getElementById('cancelEditBtn');
// const editForm = document.getElementById('editProductForm');
// const editProductId = document.getElementById('editProductId');
// const editTitle = document.getElementById('editTitle');
// const editPrice = document.getElementById('editPrice');
// const editQuantity = document.getElementById('editQuantity');

// // Category Modal
// const categoryModal = document.getElementById('categorySelectionModal');
// const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
// const cancelCategoryModalBtn = document.getElementById('cancelCategoryModalBtn');
// const categoryListModal = document.getElementById('categoryListModal');

// // Main content area (for blur) - FIXED SELECTORS
// const mainContent = document.querySelector('.col-span-1.md\\:col-span-4');
// const sidebar = document.querySelector('.col-span-1.bg-green-800'); 

// // State
// let allCategories = [];
// let allProducts = [];
// let selectedCategoryName = null;

// // Toast 
// function showToast(message, type = 'info') {
// let toastContainer = document.getElementById('toastContainer');
// if (!toastContainer) {
// toastContainer = document.createElement('div');
// toastContainer.id = 'toastContainer';
// toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
// document.body.appendChild(toastContainer);
// }

// const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500', warning: 'bg-yellow-500' };
// const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };

// const toast = document.createElement('div');
// toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
// toast.style.animation = 'slideInRight 0.3s ease-out';
// toast.innerHTML = `
// <i class="fas ${icons[type]}"></i>
// <span class="flex-1 text-sm">${message}</span>
// <button class="toast-close hover:text-gray-200 ml-2"><i class="fas fa-times"></i></button>
// `;
// toastContainer.appendChild(toast);

// const timeout = setTimeout(() => removeToast(toast), 4000);
// toast.querySelector('.toast-close').addEventListener('click', () => {
// clearTimeout(timeout);
// removeToast(toast);
// });
// }

// function removeToast(toast) {
// toast.style.animation = 'slideOutRight 0.3s ease-in';
// setTimeout(() => toast.remove(), 300);
// }

// // ========== Fetch helper ==========
// async function fetchAPI(url, options = {}) {
// try {
// const response = await fetch(url, {
// ...options,
// headers: {
// 'Authorization': `Bearer ${authToken}`,
// 'Content-Type': 'application/json',
// ...options.headers
// }
// });
// if (!response.ok) throw new Error(`HTTP ${response.status}`);
// return await response.json();
// } catch (error) {
// console.error('fetchAPI error:', error);
// return null;
// }
// }

// // ========== Blur helpers - FIXED ==========
// function blurPage() {
// const mainContent = document.querySelector('.col-span-1.md\\:col-span-4');
// const sidebar = document.querySelector('.col-span-1.bg-green-800');
// if (mainContent) mainContent.style.filter = 'blur(3px)';
// if (sidebar) sidebar.style.filter = 'blur(3px)';
// }

// function unblurPage() {
// const mainContent = document.querySelector('.col-span-1.md\\:col-span-4');
// const sidebar = document.querySelector('.col-span-1.bg-green-800');
// if (mainContent) mainContent.style.filter = '';
// if (sidebar) sidebar.style.filter = '';
// }


// async function loadData() {
// if (!productGrid) return;

// productGrid.innerHTML = `
// <div class="col-span-full text-center py-10">
// <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
// <p class="text-gray-500 mt-2">Loading products...</p>
// </div>`;

// const catData = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`);
// allCategories = Array.isArray(catData) ? catData : (catData?.data || []);

// const prodData = await fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}`);
// allProducts = Array.isArray(prodData) ? prodData : (prodData?.data || []);

// selectedCategoryName = null;
// hideFilterIndicator();
// displayProducts(allProducts);
// }

// // ========== Load products by category ==========
// async function loadProductsByCategory(categoryId, categoryName) {
// if (!productGrid) return;

// productGrid.innerHTML = `
// <div class="col-span-full text-center py-10">
// <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
// <p class="text-gray-500 mt-2">Loading...</p>
// </div>`;

// const data = await fetchAPI(`${API_BASE}/products?merchant_id=${merchantId}&category_id=${categoryId}`);
// let fetched = Array.isArray(data) ? data : (data?.data || []);

// if (fetched.length === 0) {
// fetched = allProducts.filter(p => String(p.category_id) === String(categoryId));
// }

// selectedCategoryName = categoryName;
// showFilterIndicator(categoryName);
// displayProducts(fetched);
// showToast(`Showing "${categoryName}" products`, 'success');
// }

// // ========== Display products ==========
// function displayProducts(products) {
// if (!productGrid) return;

// if (!products || products.length === 0) {
// productGrid.innerHTML = `
// <div class="col-span-full text-center py-10">
// <i class="fas fa-box-open text-4xl text-gray-400"></i>
// <p class="text-gray-500 mt-2">${selectedCategoryName ? `No products found in "${selectedCategoryName}".` : 'No products found.'}</p>
// <a href="./createproduct.html" class="inline-block mt-4 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">
// Create a product
// </a>
// </div>`;
// return;
// }

// productGrid.innerHTML = products.map(product => {
// const category = allCategories.find(c => String(c.id) === String(product.category_id));
// const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x200?text=Product';

// return `
// <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
// <img src="${imageUrl}" alt="${escapeHtml(product.title)}" class="w-full h-48 object-cover">
// <div class="p-4">
// <h3 class="text-lg font-semibold">${escapeHtml(product.title)}</h3>
// <p class="text-green-800 font-bold mt-1">$${Number(product.price).toFixed(2)}</p>
// ${category ? `<p class="text-sm text-gray-500 mt-1"><i class="fas fa-tag mr-1"></i>${escapeHtml(category.name)}</p>` : ''}
// <p class="text-sm text-gray-500"><i class="fas fa-boxes mr-1"></i>Stock: ${product.quantity || 0}</p>
// <div class="mt-4 flex gap-2">
// <button class="edit-btn flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
// data-id="${product.id}" data-title="${escapeHtml(product.title)}"
// data-price="${product.price}" data-quantity="${product.quantity || 0}">
// <i class="fas fa-edit"></i> Edit
// </button>
// <button class="delete-btn flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
// data-id="${product.id}" data-title="${escapeHtml(product.title)}">
// <i class="fas fa-trash"></i> Delete
// </button>
// </div>
// </div>
// </div>`;
// }).join('');

// attachHandlers();
// }

// // ========== Attach edit/delete handlers ==========
// function attachHandlers() {
// document.querySelectorAll('.edit-btn').forEach(btn => {
// btn.addEventListener('click', () => {
// editProductId.value = btn.dataset.id;
// editTitle.value = btn.dataset.title;
// editPrice.value = btn.dataset.price;
// editQuantity.value = btn.dataset.quantity;
// openEditModal();
// });
// });

// document.querySelectorAll('.delete-btn').forEach(btn => {
// btn.addEventListener('click', async () => {
// if (confirm(`Delete "${btn.dataset.title}"?`)) {
// await fetchAPI(`${API_BASE}/products/${btn.dataset.id}`, { method: 'DELETE' });
// showToast(`"${btn.dataset.title}" deleted!`, 'success');
// await loadData();
// if (selectedCategoryName) {
// const cat = allCategories.find(c => c.name === selectedCategoryName);
// if (cat) loadProductsByCategory(cat.id, cat.name);
// }
// }
// });
// });
// }

// // ========== Filter indicator ==========
// function showFilterIndicator(categoryName) {
// if (filterCategoryNameEl) filterCategoryNameEl.textContent = categoryName;
// if (activeFilterIndicator) activeFilterIndicator.classList.remove('hidden');
// }

// function hideFilterIndicator() {
// if (activeFilterIndicator) activeFilterIndicator.classList.add('hidden');
// }

// // ========== Show all ==========
// function showAll() {
// selectedCategoryName = null;
// hideFilterIndicator();
// displayProducts(allProducts);
// showToast('Showing all products', 'info');
// }

// // ========== Edit modal ==========
// function openEditModal() {
// if (editModal) {
// editModal.classList.remove('hidden');
// editModal.classList.add('flex');
// blurPage();
// }
// }

// function closeEditModal() {
// if (editModal) {
// editModal.classList.add('hidden');
// editModal.classList.remove('flex');
// unblurPage();
// }
// }

// // ========== Category modal ==========
// function openCategoryModal() {
// if (allCategories.length === 0) {
// showToast('No categories found. Create one first.', 'warning');
// return;
// }

// if (categoryListModal) {
// categoryListModal.innerHTML = allCategories.map(cat => `
// <button class="select-cat-btn w-full text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition"
// data-id="${cat.id}" data-name="${escapeHtml(cat.name)}">
// <i class="fas fa-folder text-blue-500 mr-2"></i>${escapeHtml(cat.name)}
// </button>
// `).join('');

// document.querySelectorAll('.select-cat-btn').forEach(btn => {
// btn.addEventListener('click', () => {
// closeCategoryModal();
// loadProductsByCategory(btn.dataset.id, btn.dataset.name);
// });
// });
// }

// if (categoryModal) {
// categoryModal.classList.remove('hidden');
// categoryModal.classList.add('flex');
// blurPage();
// }
// }

// function closeCategoryModal() {
// if (categoryModal) {
// categoryModal.classList.add('hidden');
// categoryModal.classList.remove('flex');
// unblurPage();
// }
// }

// // ========== Edit form submit ==========
// if (editForm) {
// editForm.addEventListener('submit', async (e) => {
// e.preventDefault();
// const result = await fetchAPI(`${API_BASE}/products/${editProductId.value}`, {
// method: 'PUT',
// body: JSON.stringify({
// title: editTitle.value.trim(),
// price: parseFloat(editPrice.value),
// quantity: parseInt(editQuantity.value, 10)
// })
// });
// if (result) {
// showToast('Product updated!', 'success');
// closeEditModal();
// await loadData();
// if (selectedCategoryName) {
// const cat = allCategories.find(c => c.name === selectedCategoryName);
// if (cat) loadProductsByCategory(cat.id, cat.name);
// }
// } else {
// showToast('Failed to update product', 'error');
// }
// });
// }

// // ========== Event listeners ==========
// if (filterMyProductsBtn) filterMyProductsBtn.addEventListener('click', openCategoryModal);
// if (showAllBtn) showAllBtn.addEventListener('click', showAll);
// if (clearFilterBtn) clearFilterBtn.addEventListener('click', showAll);
// if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
// if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
// if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
// if (cancelCategoryModalBtn) cancelCategoryModalBtn.addEventListener('click', closeCategoryModal);

// if (signOutBtn) {
// signOutBtn.addEventListener('click', (e) => {
// e.preventDefault();
// localStorage.clear();
// showToast('Signed out', 'success');
// setTimeout(() => window.location.href = 'loginadmin.html', 500);
// });
// }

// // ========== Escape HTML ==========
// function escapeHtml(str) {
// if (!str) return '';
// return str.replace(/[&<>]/g, m => {
// if (m === '&') return '&amp;';
// if (m === '<') return '&lt;';
// if (m === '>') return '&gt;';
// return m;
// });
// }

// // ========== CSS animations ==========
// const style = document.createElement('style');
// style.textContent = `
// @keyframes slideInRight {
// from { transform: translateX(100%); opacity: 0; }
// to { transform: translateX(0); opacity: 1; }
// }
// @keyframes slideOutRight {
// from { transform: translateX(0); opacity: 1; }
// to { transform: translateX(100%); opacity: 0; }
// }
// `;
// document.head.appendChild(style);

// // ========== Initialize ==========
// loadData();



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
const filterCategoryNameEl = document.getElementById('filterCategoryName');
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
let allProducts = [];
let currentCategoryFilter = null; // Track current category filter

// Toast function
function showToast(message, type = 'info') {
let toastContainer = document.getElementById('toastContainer');
if (!toastContainer) {
toastContainer = document.createElement('div');
toastContainer.id = 'toastContainer';
toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
document.body.appendChild(toastContainer);
}

const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500', warning: 'bg-yellow-500' };
const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };

const toast = document.createElement('div');
toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
toast.style.animation = 'slideInRight 0.3s ease-out';
toast.innerHTML = `
<i class="fas ${icons[type]}"></i>
<span class="flex-1 text-sm">${message}</span>
<button class="toast-close hover:text-gray-200 ml-2"><i class="fas fa-times"></i></button>
`;
toastContainer.appendChild(toast);

const timeout = setTimeout(() => removeToast(toast), 4000);
toast.querySelector('.toast-close').addEventListener('click', () => {
clearTimeout(timeout);
removeToast(toast);
});
}

function removeToast(toast) {
toast.style.animation = 'slideOutRight 0.3s ease-in';
setTimeout(() => toast.remove(), 300);
}

// Fetch helper
async function fetchAPI(url, options = {}) {
try {
const response = await fetch(url, {
...options,
headers: {
'Authorization': `Bearer ${authToken}`,
'Content-Type': 'application/json',
...options.headers
}
});
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return await response.json();
} catch (error) {
console.error('fetchAPI error:', error);
return null;
}
}

// Fetch ALL products with pagination
async function fetchAllProducts() {
let allFetchedProducts = [];
let page = 1;
const limit = 100;

while (true) {
const url = `${API_BASE}/products?merchant_id=${merchantId}&page=${page}&limit=${limit}`;
console.log(`Fetching products page ${page}...`);

const response = await fetchAPI(url);
let products = Array.isArray(response) ? response : (response?.data || []);

if (products.length === 0) {
break;
}

allFetchedProducts = [...allFetchedProducts, ...products];
console.log(`Page ${page}: Got ${products.length} products, Total: ${allFetchedProducts.length}`);

if (products.length < limit) {
break;
}

if (response?.pagination && page >= response.pagination.total_pages) {
break;
}

page++;
if (page > 50) break;
}

console.log(`Total products fetched: ${allFetchedProducts.length}`);
return allFetchedProducts;
}

// Blur helpers
function blurPage() {
const mainContent = document.querySelector('.col-span-1.md\\:col-span-4');
const sidebar = document.querySelector('.col-span-1.bg-green-800');
if (mainContent) mainContent.style.filter = 'blur(3px)';
if (sidebar) sidebar.style.filter = 'blur(3px)';
}

function unblurPage() {
const mainContent = document.querySelector('.col-span-1.md\\:col-span-4');
const sidebar = document.querySelector('.col-span-1.bg-green-800');
if (mainContent) mainContent.style.filter = '';
if (sidebar) sidebar.style.filter = '';
}

// Load all data
async function loadData() {
if (!productGrid) return;

productGrid.innerHTML = `
<div class="col-span-full text-center py-10">
<i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
<p class="text-gray-500 mt-2">Loading products...</p>
</div>`;

try {
// Fetch categories
const catData = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`);
allCategories = Array.isArray(catData) ? catData : (catData?.data || []);
console.log('Categories loaded:', allCategories.length);

// Fetch ALL products
allProducts = await fetchAllProducts();

currentCategoryFilter = null;
hideFilterIndicator();
displayProducts(allProducts);

if (allProducts.length === 0) {
showToast('No products found. Create your first product!', 'info');
} else {
showToast(`Loaded ${allProducts.length} products successfully`, 'success');
}
} catch (error) {
console.error('Error loading data:', error);
productGrid.innerHTML = `
<div class="col-span-full text-center py-10">
<i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
<p class="text-gray-500 mt-2">Error loading products. Please try again.</p>
<button onclick="location.reload()" class="mt-4 bg-green-800 text-white px-4 py-2 rounded-lg">Retry</button>
</div>`;
showToast('Error loading products', 'error');
}
}

// Filter products by category (from already loaded products)
function filterProductsByCategory(categoryId, categoryName) {
if (!allProducts.length) {
showToast('Products not loaded yet', 'warning');
return;
}

const filteredProducts = allProducts.filter(product => String(product.category_id) === String(categoryId));
console.log(`Filtering by category ${categoryName}: Found ${filteredProducts.length} products`);

currentCategoryFilter = { id: categoryId, name: categoryName };
showFilterIndicator(categoryName);
displayProducts(filteredProducts);
showToast(`Showing ${filteredProducts.length} products in "${categoryName}"`, 'success');
}

// Load products by category (using API with pagination)
async function loadProductsByCategory(categoryId, categoryName) {
if (!productGrid) return;

productGrid.innerHTML = `
<div class="col-span-full text-center py-10">
<i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
<p class="text-gray-500 mt-2">Loading products in ${categoryName}...</p>
</div>`;

try {
// Fetch products for this category with pagination
let fetched = [];
let page = 1;
const limit = 100;

while (true) {
const url = `${API_BASE}/products?merchant_id=${merchantId}&category_id=${categoryId}&page=${page}&limit=${limit}`;
console.log(`Fetching category products page ${page}...`);

const response = await fetchAPI(url);
let products = Array.isArray(response) ? response : (response?.data || []);

if (products.length === 0) {
break;
}

fetched = [...fetched, ...products];
console.log(`Page ${page}: Got ${products.length} products, Total: ${fetched.length}`);

if (products.length < limit) {
break;
}

if (response?.pagination && page >= response.pagination.total_pages) {
break;
}

page++;
if (page > 50) break;
}

if (fetched.length === 0) {
console.log('API returned no products, checking local data');
// If API returns nothing, check if we have products in local allProducts
const localFiltered = allProducts.filter(p => String(p.category_id) === String(categoryId));
if (localFiltered.length > 0) {
fetched = localFiltered;
console.log(`Using local filtered products: ${fetched.length}`);
}
}

currentCategoryFilter = { id: categoryId, name: categoryName };
showFilterIndicator(categoryName);
displayProducts(fetched);
showToast(`Showing ${fetched.length} products in "${categoryName}"`, 'success');

} catch (error) {
console.error('Error loading category products:', error);

// Fallback to local filtering
const localFiltered = allProducts.filter(p => String(p.category_id) === String(categoryId));
if (localFiltered.length > 0) {
currentCategoryFilter = { id: categoryId, name: categoryName };
showFilterIndicator(categoryName);
displayProducts(localFiltered);
showToast(`Showing ${localFiltered.length} products from local data`, 'warning');
} else {
displayProducts([]);
showToast(`No products found in "${categoryName}"`, 'info');
}
}
}

// Display products
function displayProducts(products) {
if (!productGrid) return;

if (!products || products.length === 0) {
productGrid.innerHTML = `
<div class="col-span-full text-center py-10">
<i class="fas fa-box-open text-4xl text-gray-400"></i>
<p class="text-gray-500 mt-2">${currentCategoryFilter ? `No products found in "${currentCategoryFilter.name}".` : 'No products found.'}</p>
<a href="./createproduct.html" class="inline-block mt-4 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">
Create a product
</a>
</div>`;
return;
}

productGrid.innerHTML = products.map(product => {
const category = allCategories.find(c => String(c.id) === String(product.category_id));
const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x200?text=Product';

return `
<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
<img src="${imageUrl}" alt="${escapeHtml(product.title)}" class="w-full h-48 object-cover">
<div class="p-4">
<h3 class="text-lg font-semibold">${escapeHtml(product.title)}</h3>
<p class="text-green-800 font-bold mt-1">₦${Number(product.price).toLocaleString()}</p>
${category ? `<p class="text-sm text-gray-500 mt-1"><i class="fas fa-tag mr-1"></i>${escapeHtml(category.name)}</p>` : ''}
<p class="text-sm text-gray-500"><i class="fas fa-boxes mr-1"></i>Stock: ${product.quantity || 0}</p>
<div class="mt-4 flex gap-2">
<button class="edit-btn flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
data-id="${product.id}" data-title="${escapeHtml(product.title)}"
data-price="${product.price}" data-quantity="${product.quantity || 0}">
<i class="fas fa-edit"></i> Edit
</button>
<button class="delete-btn flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
data-id="${product.id}" data-title="${escapeHtml(product.title)}">
<i class="fas fa-trash"></i> Delete
</button>
</div>
</div>
</div>`;
}).join('');

attachHandlers();
}

// Attach edit/delete handlers
function attachHandlers() {
document.querySelectorAll('.edit-btn').forEach(btn => {
btn.addEventListener('click', () => {
editProductId.value = btn.dataset.id;
editTitle.value = btn.dataset.title;
editPrice.value = btn.dataset.price;
editQuantity.value = btn.dataset.quantity;
openEditModal();
});
});

document.querySelectorAll('.delete-btn').forEach(btn => {
btn.addEventListener('click', async () => {
if (confirm(`Delete "${btn.dataset.title}"?`)) {
await fetchAPI(`${API_BASE}/products/${btn.dataset.id}`, { method: 'DELETE' });
showToast(`"${btn.dataset.title}" deleted!`, 'success');
await loadData();
if (currentCategoryFilter) {
loadProductsByCategory(currentCategoryFilter.id, currentCategoryFilter.name);
}
}
});
});
}

// Filter indicator
function showFilterIndicator(categoryName) {
if (filterCategoryNameEl) filterCategoryNameEl.textContent = categoryName;
if (activeFilterIndicator) activeFilterIndicator.classList.remove('hidden');
}

function hideFilterIndicator() {
if (activeFilterIndicator) activeFilterIndicator.classList.add('hidden');
}

// Show all
function showAll() {
currentCategoryFilter = null;
hideFilterIndicator();
displayProducts(allProducts);
showToast(`Showing all ${allProducts.length} products`, 'info');
}

// Edit modal
function openEditModal() {
if (editModal) {
editModal.classList.remove('hidden');
editModal.classList.add('flex');
blurPage();
}
}

function closeEditModal() {
if (editModal) {
editModal.classList.add('hidden');
editModal.classList.remove('flex');
unblurPage();
}
}

// Category modal
function openCategoryModal() {
if (allCategories.length === 0) {
showToast('No categories found. Create one first.', 'warning');
return;
}

if (categoryListModal) {
categoryListModal.innerHTML = allCategories.map(cat => `
<button class="select-cat-btn w-full text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition"
data-id="${cat.id}" data-name="${escapeHtml(cat.name)}">
<i class="fas fa-folder text-blue-500 mr-2"></i>${escapeHtml(cat.name)}
</button>
`).join('');

document.querySelectorAll('.select-cat-btn').forEach(btn => {
btn.addEventListener('click', () => {
closeCategoryModal();
loadProductsByCategory(btn.dataset.id, btn.dataset.name);
});
});
}

if (categoryModal) {
categoryModal.classList.remove('hidden');
categoryModal.classList.add('flex');
blurPage();
}
}

function closeCategoryModal() {
if (categoryModal) {
categoryModal.classList.add('hidden');
categoryModal.classList.remove('flex');
unblurPage();
}
}

// Edit form submit
if (editForm) {
editForm.addEventListener('submit', async (e) => {
e.preventDefault();
const result = await fetchAPI(`${API_BASE}/products/${editProductId.value}`, {
method: 'PUT',
body: JSON.stringify({
title: editTitle.value.trim(),
price: parseFloat(editPrice.value),
quantity: parseInt(editQuantity.value, 10)
})
});
if (result) {
showToast('Product updated!', 'success');
closeEditModal();
await loadData();
if (currentCategoryFilter) {
loadProductsByCategory(currentCategoryFilter.id, currentCategoryFilter.name);
}
} else {
showToast('Failed to update product', 'error');
}
});
}

// Event listeners
if (filterMyProductsBtn) filterMyProductsBtn.addEventListener('click', openCategoryModal);
if (showAllBtn) showAllBtn.addEventListener('click', showAll);
if (clearFilterBtn) clearFilterBtn.addEventListener('click', showAll);
if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
if (cancelCategoryModalBtn) cancelCategoryModalBtn.addEventListener('click', closeCategoryModal);

if (signOutBtn) {
signOutBtn.addEventListener('click', (e) => {
e.preventDefault();
localStorage.clear();
showToast('Signed out', 'success');
setTimeout(() => window.location.href = 'loginadmin.html', 500);
});
}

// Escape HTML
function escapeHtml(str) {
if (!str) return '';
return str.replace(/[&<>]/g, m => {
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
loadData();