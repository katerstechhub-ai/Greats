const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

const merchantId = localStorage.getItem('merchantId');
const authToken = localStorage.getItem('authToken');

if (!merchantId || !authToken) {
    showToast('Please log in first', 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);


}

// DOM elements
const form = document.getElementById('createProductForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const imagesInput = document.getElementById('images');
const categorySelect = document.getElementById('categorySelect');
const brandInput = document.getElementById('brand');
const minQtyInput = document.getElementById('minQty');
const maxQtyInput = document.getElementById('maxQty');
const discountInput = document.getElementById('discount');
const cancelBtn = document.getElementById('cancelBtn');
const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');

// Modal elements
const modal = document.getElementById('categoryModal');
const categoryListDiv = document.getElementById('categoryList');
const closeModalBtns = document.querySelectorAll('#closeModalBtn, #modalCloseBtn');

// ========== Toast Notification System ==========
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

    const timeout = setTimeout(() => {
        removeToast(toast);
    }, 4000);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        removeToast(toast);
    });
}

function removeToast(toast) {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
        toast.remove();
    }, 300);
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

// ========== Load categories into dropdown ==========
async function loadCategories() {
    const data = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`);
    let categories = [];
    if (Array.isArray(data)) categories = data;
    else if (data && data.data && Array.isArray(data.data)) categories = data.data;

    categorySelect.innerHTML = '<option value="">-- Select a category --</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}

// ========== Load categories into modal for deletion ==========
async function loadCategoriesForModal() {
    const data = await fetchAPI(`${API_BASE}/categories?merchant_id=${merchantId}`);
    let categories = [];
    if (Array.isArray(data)) categories = data;
    else if (data && data.data && Array.isArray(data.data)) categories = data.data;

    if (categories.length === 0) {
        categoryListDiv.innerHTML = '<p class="text-gray-500 text-center">No categories found.</p>';
        return;
    }

    categoryListDiv.innerHTML = categories.map(cat => `
<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
<span class="text-gray-800">${escapeHtml(cat.name)}</span>
<button class="delete-cat-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
data-id="${cat.id}"
data-name="${escapeHtml(cat.name)}">
<i class="fas fa-trash-alt mr-1"></i> Delete
</button>
</div>
`).join('');

    document.querySelectorAll('.delete-cat-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const catId = btn.getAttribute('data-id');
            const catName = btn.getAttribute('data-name');
            await deleteCategory(catId, catName);
        });
    });
}

async function deleteCategory(categoryId, categoryName) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    modalDiv.innerHTML = `
<div class="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
<h3 class="text-lg font-semibold mb-4">Delete Category</h3>
<p class="text-gray-600 mb-6">Are you sure you want to delete "${categoryName}"?</p>
<div class="flex justify-end gap-3">
<button id="confirmNo" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
<button id="confirmYes" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
</div>
</div>
`;
    document.body.appendChild(modalDiv);

    const handleNo = () => {
        modalDiv.remove();
    };

    const handleYes = async () => {
        modalDiv.remove();
        const response = await fetchAPI(`${API_BASE}/categories/${categoryId}`, { method: 'DELETE' });
        if (response !== null) {
            showToast(`✅ Category "${categoryName}" deleted successfully!`, 'success');
            await loadCategories();
            await loadCategoriesForModal();
            if (categorySelect.value === categoryId) {
                categorySelect.value = '';
            }
        } else {
            showToast(`❌ Failed to delete category.`, 'error');
        }
    };

    document.getElementById('confirmNo').addEventListener('click', handleNo);
    document.getElementById('confirmYes').addEventListener('click', handleYes);
}

async function openModal() {
    await loadCategoriesForModal();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

if (deleteCategoryBtn) deleteCategoryBtn.addEventListener('click', openModal);
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

// ========== Create product ==========
async function createProduct() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = parseFloat(priceInput.value);
    const quantity = parseInt(quantityInput.value, 10);
    const categoryId = categorySelect.value;

    if (!title) {
        showToast('Please enter a product title', 'warning');
        titleInput.focus();
        return;
    }
    if (!price || isNaN(price)) {
        showToast('Please enter a valid price', 'warning');
        priceInput.focus();
        return;
    }
    if (!quantity || isNaN(quantity)) {
        showToast('Please enter a valid quantity', 'warning');
        quantityInput.focus();
        return;
    }
    if (!categoryId) {
        showToast('Please select a category', 'warning');
        categorySelect.focus();
        return;
    }

    // Process images
    let images = [];
    if (imagesInput.value.trim()) {
        images = imagesInput.value.split('\n')
            .map(url => url.trim())
            .filter(url => url !== '');
    }

    if (images.length === 0) {
        images = ['https://via.placeholder.com/300x200?text=Product'];
    }

    const productData = {
        title: title,
        descp: description,
        price: price,
        quantity: quantity,
        images: images,
        currency: 'NGN',
        category_id: categoryId,
        merchant_id: merchantId
    };

    if (brandInput.value.trim()) productData.brand = brandInput.value.trim();
    if (minQtyInput.value) productData.min_qty = parseInt(minQtyInput.value);
    if (maxQtyInput.value) productData.max_qty = parseInt(maxQtyInput.value);
    if (discountInput.value) productData.discount = parseFloat(discountInput.value);

    const response = await fetchAPI(`${API_BASE}/products`, {
        method: 'POST',
        body: JSON.stringify(productData)
    });

    if (response) {
        showToast('✅ Product created successfully!', 'success');
        form.reset();
        await loadCategories();
    } else {
        showToast('❌ Failed to create product', 'error');
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    createProduct();
});

cancelBtn.addEventListener('click', () => {
    window.location.href = 'productadmin.html';
});

document.getElementById('signOutBtn').addEventListener('click', (e) => {
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
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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

loadCategories();








