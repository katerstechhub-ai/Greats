// ========== Configuration ==========
const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

// Get merchant credentials from localStorage
const merchantId = localStorage.getItem('merchantId');
const authToken = localStorage.getItem('authToken');

// Redirect to login if not authenticated
if (!merchantId || !authToken) {
    alert('Please log in first');
    window.location.href = 'login.html';
}

// ========== DOM Elements ==========
const form = document.getElementById('createCategoryForm');
const categoryNameInput = document.getElementById('categoryName');
const cancelBtn = document.getElementById('cancelBtn');
const signOutBtn = document.getElementById('signOutBtn');

// ========== Helper: fetch with auth ==========
async function fetchAPI(url, options = {}) {
    const defaultHeaders = {
        'Authorization': `Bearer ${ authToken }`,
    'Content-Type': 'application/json'
};
try {
    const response = await fetch(url, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
    });
    if (!response.ok) throw new Error`(HTTP ${ response.status })`;
    return await response.json();
} catch (error) {
    console.error(Error `fetching ${url}:, error`);
    return null;
}
}

// ========== Pre‑fill category name from URL parameter ==========
function prefillCategoryName() {
    const urlParams = new URLSearchParams(window.location.search);
    const suggestedName = urlParams.get('suggestedName');
    if (suggestedName && categoryNameInput) {
        categoryNameInput.value = decodeURIComponent(suggestedName);
    }
}

// ========== Create category ==========
async function createCategory(categoryName) {
    const payload = {
        name: categoryName,
        merchant_id: merchantId
    };

    const response = await fetchAPI(`${ API_BASE }/categories`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (response && (response.id || response.data?.id)) {
        alert('Category created successfully!');
        // Redirect back to product creation page
        window.location.href = 'createproduct.html';
    } else {
        alert('Failed to create category. Check console for details.');
    }
}

// ========== Form submission ==========
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoryName = categoryNameInput.value.trim();
    if (!categoryName) {
        alert('Please enter a category name.');
        return;
    }

    await createCategory(categoryName);
});

// ========== Cancel button ==========
cancelBtn.addEventListener('click', () => {
    window.location.href = 'createproduct.html';
});

// ========== Sign out ==========
if (signOutBtn) {
    signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('merchantId');
        localStorage.removeItem('authToken');
        window.location.href = 'loginadmin.html';
    });
}

// ========== Initialization ==========
prefillCategoryName()