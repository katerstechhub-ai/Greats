// // ========== Configuration ==========
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
// const usersTableBody = document.getElementById('usersTableBody');
// const searchInput = document.getElementById('searchInput');

// // Edit Modal Elements
// const editModal = document.getElementById('editModal');
// const closeEditModalBtn = document.getElementById('closeEditModalBtn');
// const cancelEditBtn = document.getElementById('cancelEditBtn');
// const editForm = document.getElementById('editUserForm');
// const editUserId = document.getElementById('editUserId');
// const editFirstName = document.getElementById('editFirstName');
// const editLastName = document.getElementById('editLastName');
// const editEmail = document.getElementById('editEmail');
// const editPhone = document.getElementById('editPhone');
// const editRole = document.getElementById('editRole');

// // Delete Modal Elements
// const deleteModal = document.getElementById('deleteModal');
// const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
// const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
// const deleteUserName = document.getElementById('deleteUserName');

// // State
// let allUsers = [];
// let currentDeleteId = null;

// // ========== Toast Notification ==========
// function showToast(message, type = 'info') {
//     let toastContainer = document.getElementById('toastContainer');
//     if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.id = 'toastContainer';
//         toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
//         document.body.appendChild(toastContainer);
//     }

//     const toast = document.createElement('div');
//     const colors = {
//         success: 'bg-green-500',
//         error: 'bg-red-500',
//         info: 'bg-blue-500',
//         warning: 'bg-yellow-500'
//     };

//     toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`;
//     toast.style.animation = 'slideInRight 0.3s ease-out';
//     toast.innerHTML = `
// <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
// <span class="flex-1 text-sm">${message}</span>
// <button class="toast-close hover:text-gray-200 ml-2">
// <i class="fas fa-times"></i>
// </button>
// `;

//     toastContainer.appendChild(toast);

//     setTimeout(() => {
//         if (toast && toast.remove) {
//             toast.style.animation = 'slideOutRight 0.3s ease-in';
//             setTimeout(() => toast.remove(), 300);
//         }
//     }, 4000);

//     const closeBtn = toast.querySelector('.toast-close');
//     closeBtn.addEventListener('click', () => {
//         toast.style.animation = 'slideOutRight 0.3s ease-in';
//         setTimeout(() => toast.remove(), 300);
//     });
// }

// // ========== Helper: fetch with auth ==========
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
//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`HTTP ${response.status}: ${errorText}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching ${url}:`, error);
//         showToast(`Error: ${error.message}`, 'error');
//         return null;
//     }
// }

// // ========== Load Users ==========
// async function loadUsers() {
//     usersTableBody.innerHTML = `
// <tr>
// <td colspan="7" class="px-4 py-8 text-center text-gray-500">
// <i class="fas fa-spinner fa-spin text-2xl"></i>
// <p class="mt-2">Loading users...</p>
// </td>
// </tr>
// `;

//     const data = await fetchAPI(`${API_BASE}/users?merchant_id=${merchantId}`);
//     allUsers = Array.isArray(data) ? data : (data?.data || []);

//     console.log('Users loaded:', allUsers.length);
//     displayUsers(allUsers);
// }

// // ========== Display Users ==========
// function displayUsers(users) {
//     if (users.length === 0) {
//         usersTableBody.innerHTML = `
// <tr>
// <td colspan="7" class="px-4 py-8 text-center text-gray-500">
// <i class="fas fa-users text-4xl text-gray-300 mb-2"></i>
// <p>No users found</p>
// <a href="./createuser.html" class="inline-block mt-2 text-blue-600 hover:text-blue-700">Create your first user</a>
// </td>
// </tr>
// `;
//         return;
//     }

//     usersTableBody.innerHTML = users.map((user, index) => `
// <tr class="border-b hover:bg-gray-50 transition">
// <td class="px-4 py-3 text-sm text-gray-500">${index + 1}</td>
// <td class="px-4 py-3">
// <div class="font-medium text-gray-800">${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</div>
// </td>
// <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(user.email)}</td>
// <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(user.phone || 'N/A')}</td>
// <td class="px-4 py-3">
// <span class="px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(user.role)}">
// ${escapeHtml(user.role || 'user')}
// </span>
// </td>
// <td class="px-4 py-3 text-sm text-gray-500">${formatDate(user.created_at)}</td>
// <td class="px-4 py-3">
// <div class="flex gap-2">
// <button onclick="openEditModal('${user.id}')"
// class="text-yellow-600 hover:text-yellow-800 transition"
// title="Edit">
// <i class="fas fa-edit"></i>
// </button>
// <button onclick="openDeleteModal('${user.id}', '${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}')"
// class="text-red-600 hover:text-red-800 transition"
// title="Delete">
// <i class="fas fa-trash-alt"></i>
// </button>
// </div>
// </td>
// </tr>
// `).join('');
// }

// // ========== Helper: Role Badge Class ==========
// function getRoleBadgeClass(role) {
//     switch (role) {
//         case 'admin':
//             return 'bg-red-100 text-red-800';
//         case 'editor':
//             return 'bg-blue-100 text-blue-800';
//         default:
//             return 'bg-gray-100 text-gray-800';
//     }
// }

// // ========== Helper: Format Date ==========
// function formatDate(dateString) {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
// }

// // ========== Search Users ==========
// function searchUsers() {
//     const searchTerm = searchInput.value.toLowerCase().trim();
//     if (!searchTerm) {
//         displayUsers(allUsers);
//         return;
//     }

//     const filtered = allUsers.filter(user => {
//         const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
//         return fullName.includes(searchTerm) ||
//             user.email.toLowerCase().includes(searchTerm) ||
//             (user.phone && user.phone.includes(searchTerm));
//     });

//     displayUsers(filtered);
// }

// // ========== Edit User Modal ==========
// window.openEditModal = async function (userId) {
//     const user = allUsers.find(u => u.id === userId);
//     if (!user) return;

//     editUserId.value = user.id;
//     editFirstName.value = user.first_name || '';
//     editLastName.value = user.last_name || '';
//     editEmail.value = user.email || '';
//     editPhone.value = user.phone || '';
//     editRole.value = user.role || 'user';

//     editModal.classList.remove('hidden');
//     editModal.classList.add('flex');
// };

// function closeEditModal() {
//     editModal.classList.add('hidden');
//     editModal.classList.remove('flex');
// }

// // ========== Update User ==========
// async function updateUser(userId, userData) {
//     const response = await fetchAPI(`${API_BASE}/users/${userId}`, {
//         method: 'PUT',
//         body: JSON.stringify(userData)
//     });

//     if (response) {
//         showToast('✅ User updated successfully!', 'success');
//         closeEditModal();
//         await loadUsers();
//         return true;
//     } else {
//         showToast('❌ Failed to update user', 'error');
//         return false;
//     }
// }

// // ========== Edit Form Submit ==========
// editForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const userId = editUserId.value;
//     const userData = {
//         first_name: editFirstName.value.trim(),
//         last_name: editLastName.value.trim(),
//         email: editEmail.value.trim(),
//         phone: editPhone.value.trim(),
//         role: editRole.value,
//         merchant_id: merchantId
//     };

//     if (!userData.first_name || !userData.last_name || !userData.email) {
//         showToast('Please fill all required fields', 'warning');
//         return;
//     }

//     await updateUser(userId, userData);
// });

// // ========== Delete User Modal ==========
// window.openDeleteModal = function (userId, userName) {
//     currentDeleteId = userId;
//     deleteUserName.textContent = userName;
//     deleteModal.classList.remove('hidden');
//     deleteModal.classList.add('flex');
// };

// function closeDeleteModal() {
//     deleteModal.classList.add('hidden');
//     deleteModal.classList.remove('flex');
//     currentDeleteId = null;
// }

// // ========== Delete User ==========
// async function deleteUser(userId) {
//     const response = await fetchAPI(`${API_BASE}/users/${userId}`, {
//         method: 'DELETE'
//     });

//     if (response !== null) {
//         showToast('✅ User deleted successfully!', 'success');
//         await loadUsers();
//         return true;
//     } else {
//         showToast('❌ Failed to delete user', 'error');
//         return false;
//     }
// }

// // ========== Confirm Delete ==========
// confirmDeleteBtn.addEventListener('click', async () => {
//     if (currentDeleteId) {
//         await deleteUser(currentDeleteId);
//         closeDeleteModal();
//     }
// });

// // ========== Event Listeners ==========
// searchInput.addEventListener('input', searchUsers);
// closeEditModalBtn.addEventListener('click', closeEditModal);
// cancelEditBtn.addEventListener('click', closeEditModal);
// cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// // Close modals when clicking outside
// editModal.addEventListener('click', (e) => {
//     if (e.target === editModal) closeEditModal();
// });
// deleteModal.addEventListener('click', (e) => {
//     if (e.target === deleteModal) closeDeleteModal();
// });

// // ========== Sign Out ==========
// const signOutBtn = document.getElementById('signOutBtn');
// if (signOutBtn) {
//     signOutBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         localStorage.removeItem('merchantId');
//         localStorage.removeItem('authToken');
//         showToast('Signed out successfully', 'success');
//         setTimeout(() => {
//             window.location.href = 'loginadmin.html';
//         }, 500);
//     });
// }

// // ========== Helper: Escape HTML ==========
// function escapeHtml(str) {
//     if (!str) return '';
//     return str.replace(/[&<>]/g, function (m) {
//         if (m === '&') return '&amp;';
//         if (m === '<') return '&lt;';
//         if (m === '>') return '&gt;';
//         return m;
//     });
// }

// // ========== CSS Animations ==========
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
// loadUsers();








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
const usersTableBody = document.getElementById('usersTableBody');
const searchInput = document.getElementById('searchInput');

const editModal = document.getElementById('editModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editForm = document.getElementById('editUserForm');
const editUserId = document.getElementById('editUserId');
const editFirstName = document.getElementById('editFirstName');
const editLastName = document.getElementById('editLastName');
const editEmail = document.getElementById('editEmail');
const editPhone = document.getElementById('editPhone');
const editRole = document.getElementById('editRole');

const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteUserName = document.getElementById('deleteUserName');

// ========== State ==========
let allUsers = [];
let currentDeleteId = null;

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
        const text = await response.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch (e) { parsed = {}; }
        console.log(`Response from ${url}:`, parsed);
        return parsed;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        showToast(`Error: ${error.message}`, 'error');
        return null;
    }
}

// ========== Load Users ==========
async function loadUsers() {
    usersTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin text-2xl"></i>
                <p class="mt-2">Loading users...</p>
            </td>
        </tr>
    `;

    const data = await fetchAPI(`${API_BASE}/users?merchant_id=${merchantId}`);
    allUsers = Array.isArray(data) ? data : (data?.data || []);

    console.log('Users loaded:', allUsers.length);
    displayUsers(allUsers);
}

// ========== Display Users ==========
function displayUsers(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                    <i class="fas fa-users text-4xl text-gray-300 mb-2"></i>
                    <p>No users found</p>
                    <a href="./createuseradmin.html" class="inline-block mt-2 text-blue-600 hover:text-blue-700">Create your first user</a>
                </td>
            </tr>
        `;
        return;
    }

    usersTableBody.innerHTML = users.map((user, index) => `
        <tr class="border-b hover:bg-gray-50 transition">
            <td class="px-4 py-3 text-sm text-gray-500">${index + 1}</td>
            <td class="px-4 py-3">
                <div class="font-medium text-gray-800">${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(user.email)}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(user.phone || 'N/A')}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(user.role)}">
                    ${escapeHtml(user.role || 'user')}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">${formatDate(user.created_at)}</td>
            <td class="px-4 py-3">
                <div class="flex gap-2">
                    <button onclick="openEditModal('${user.id}')"
                        class="text-yellow-600 hover:text-yellow-800 transition" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="openDeleteModal('${user.id}', '${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}')"
                        class="text-red-600 hover:text-red-800 transition" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ========== Role Badge ==========
function getRoleBadgeClass(role) {
    switch (role) {
        case 'admin': return 'bg-red-100 text-red-800';
        case 'editor': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// ========== Format Date ==========
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ========== Search ==========
function searchUsers() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) { displayUsers(allUsers); return; }

    const filtered = allUsers.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return fullName.includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.phone && user.phone.includes(searchTerm));
    });

    displayUsers(filtered);
}

// ========== Edit User Modal ==========
window.openEditModal = function (userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    editUserId.value = user.id;
    editFirstName.value = user.first_name || '';
    editLastName.value = user.last_name || '';
    editEmail.value = user.email || '';
    editPhone.value = user.phone || '';
    editRole.value = user.role || 'user';

    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
};

function closeEditModal() {
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
}

// ========== Update User ==========
async function updateUser(userId, userData) {
    const response = await fetchAPI(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });

    if (response && !response.error && response.type !== 'INVALID_CREDENTIAL') {
        showToast('User updated successfully!', 'success');
        closeEditModal();
        await loadUsers();
        return true;
    } else {
        const msg = response?.msg || response?.message || 'Failed to update user';
        showToast(msg, 'error');
        return false;
    }
}

// ========== Edit Form Submit ==========
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = editUserId.value;
    const userData = {
        first_name: editFirstName.value.trim(),
        last_name: editLastName.value.trim(),
        email: editEmail.value.trim(),
        phone: editPhone.value.trim()
    };

    if (!userData.first_name || !userData.last_name || !userData.email) {
        showToast('Please fill all required fields', 'warning');
        return;
    }

    await updateUser(userId, userData);
});

// ========== Delete User Modal ==========
window.openDeleteModal = function (userId, userName) {
    currentDeleteId = userId;
    deleteUserName.textContent = userName;
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
};

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    currentDeleteId = null;
}

// ========== Delete User ==========
async function deleteUser(userId) {
    const response = await fetchAPI(`${API_BASE}/users/${userId}`, {
        method: 'DELETE'
    });

    if (response !== null) {
        showToast('User deleted successfully!', 'success');
        await loadUsers();
        return true;
    } else {
        showToast('Failed to delete user', 'error');
        return false;
    }
}

// ========== Event Listeners ==========
if (searchInput) searchInput.addEventListener('input', searchUsers);
if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (currentDeleteId) {
            await deleteUser(currentDeleteId);
            closeDeleteModal();
        }
    });
}

if (editModal) editModal.addEventListener('click', e => { if (e.target === editModal) closeEditModal(); });
if (deleteModal) deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });

// ========== Sign Out ==========
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('merchantId');
        localStorage.removeItem('authToken');
        showToast('Signed out successfully', 'success');
        setTimeout(() => { window.location.href = 'loginadmin.html'; }, 500);
    });
}

// ========== Add New User Button ==========
const addUserBtn = document.getElementById('addUserBtn');
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        window.location.href = './createuseradmin.html';
    });
}

// ========== Escape HTML ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
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
loadUsers();