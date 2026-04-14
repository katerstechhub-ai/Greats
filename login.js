const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {

    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('errorMessage');

    if (loginBtn) {
        loginBtn.addEventListener('click', async (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            errorDiv.classList.add('hidden');

            if (email === '' || password === '') {
                errorDiv.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('Login response:', data);

                if (data.msg === 'Invalid credential' || data.msg === 'Invalid username or password' || data.type === 'INVALID_CREDENTIAL' || data.code === 404) {
                    errorDiv.classList.remove('hidden');
                    return;
                }

                localStorage.setItem('customerId', data.id || '');
                localStorage.setItem('customerName', (data.first_name || '') + ' ' + (data.last_name || ''));
                localStorage.setItem('customerEmail', data.email || email);

                window.location.href = './index.html';

            } catch (err) {
                console.error('Login error:', err);
                errorDiv.classList.remove('hidden');
            }
        });
    }

    // ========== Newsletter Button ==========
    const signupBtn = document.getElementById('signupBtn');
    const emailInput2 = document.getElementById('emailInput');
    const successMessage = document.getElementById('successMessage');
    const errorMessage2 = document.getElementById('errorMessage2');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (signupBtn) {
        signupBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const email = emailInput2.value.trim();
            errorMessage2.classList.add('hidden');
            successMessage.classList.add('hidden');
            if (email === '') {
                errorMessage2.textContent = 'Email cannot be empty.';
                errorMessage2.classList.remove('hidden');
            } else if (!emailRegex.test(email)) {
                errorMessage2.textContent = 'Please enter a valid email address.';
                errorMessage2.classList.remove('hidden');
            } else {
                successMessage.classList.remove('hidden');
            }
        });
    }
});