const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        errorMsg.textContent = '';

        try {
            const response = await fetch(`${API_BASE}/merchants/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.msg === 'Invalid credential' || data.type === 'INVALID_CREDENTIAL') {
                throw new Error('Invalid email or password. Please try again.');
            }

            let merchantId = null;
            if (data.id) {
                merchantId = data.id;
            } else if (data.merchant_id) {
                merchantId = data.merchant_id;
            }

            if (!merchantId) {
                console.error('Could not find merchant ID in response:', data);
                throw new Error('Unable to extract merchant ID from response.');
            }

            const token = merchantId;

            localStorage.setItem('merchantId', merchantId);
            localStorage.setItem('authToken', token);

            window.location.href = 'Dashboard.html';
        } catch (err) {
            errorMsg.textContent = err.message;
            console.error(err);
        }
    });
});