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
const form = document.getElementById('createUserForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const roleSelect = document.getElementById('role');
const cancelBtn = document.getElementById('cancelBtn');

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
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        showToast(`Error: ${error.message}`, 'error');
        return null;
    }
}

// ========== Create User ==========
async function createUser(userData) {
    console.log('📝 Creating user:', userData);

    const response = await fetchAPI(`${API_BASE}/users`, {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    if (response) {
        console.log('✅ User created:', response);
        showToast('✅ User created successfully!', 'success');
        form.reset();
        return true;
    } else {
        showToast('❌ Failed to create user', 'error');
        return false;
    }
}

// ========== Form Submission ==========
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const role = roleSelect.value;

    // Validation
    if (!firstName) {
        showToast('Please enter first name', 'warning');
        firstNameInput.focus();
        return;
    }

    if (!lastName) {
        showToast('Please enter last name', 'warning');
        lastNameInput.focus();
        return;
    }

    if (!email) {
        showToast('Please enter an email address', 'warning');
        emailInput.focus();
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'warning');
        emailInput.focus();
        return;
    }

    if (!phone) {
        showToast('Please enter a phone number', 'warning');
        phoneInput.focus();
        return;
    }

    if (!password) {
        showToast('Please enter a password', 'warning');
        passwordInput.focus();
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'warning');
        confirmPasswordInput.focus();
        return;
    }

    // Build user data payload - MATCH API EXPECTED FIELDS
    const userData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        password: password,
        role: role,
        merchant_id: merchantId,
        created_at: new Date().toISOString()
    };

    await createUser(userData);
});

// ========== Cancel Button ==========
cancelBtn.addEventListener('click', () => {
    window.location.href = 'users.html';
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



  // Mobile sidebar toggle
        const menuToggle = document.getElementById('menuToggleBtn');
        const sidebar = document.getElementById('sidebar');
        const closeSidebar = document.getElementById('closeSidebarBtn');
        const overlay = document.getElementById('sidebarOverlay');

        function openSidebar() {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            overlay.classList.remove('hidden');
        }

        function closeSidebarFunc() {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            overlay.classList.add('hidden');
        }

        if (menuToggle) menuToggle.addEventListener('click', openSidebar);
        if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
        if (overlay) overlay.addEventListener('click', closeSidebarFunc);

        // Close sidebar on window resize if open
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768) {
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
                if (overlay) overlay.classList.add('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                sidebar.classList.remove('translate-x-0');
            }
        });