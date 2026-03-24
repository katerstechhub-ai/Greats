const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    errorMsg.textContent = '';

    try {
        const url = `${API_BASE}/merchants/login`;
        console.log('Request URL:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.msg || errorData.message || 'Login failed';
            } catch {
                errorMessage = HTTP `${response.status}: ${responseText}`;
            }
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        console.log('Parsed login response:', data);

        // ----- Extract merchant ID and token (flexible) -----
        let merchantId, token;

        // Try common patterns
        if (data.merchant_id && data.token) {
            merchantId = data.merchant_id;
            token = data.token;
        } else if (data.id && data.token) {
            merchantId = data.id;
            token = data.token;
        } else if (data.id && data.access_token) {
            merchantId = data.id;
            token = data.access_token;
        } else if (data.merchant && data.merchant.id && data.token) {
            merchantId = data.merchant.id;
            token = data.token;
        } else if (data.merchant && data.merchant.id && data.auth && data.auth.token) {
            merchantId = data.merchant.id;
            token = data.auth.token;
        } else if (data.data) {
            const inner = data.data;
            if (inner.merchant_id && inner.token) {
                merchantId = inner.merchant_id;
                token = inner.token;
            } else if (inner.id && inner.token) {
                merchantId = inner.id;
                token = inner.token;
            } else if (inner.id && inner.access_token) {
                merchantId = inner.id;
                token = inner.access_token;
            }
        }

        if (!merchantId || !token) {
            console.error('Could not extract merchant ID or token. Available keys:', Object.keys(data));
            if (data.data) console.error('data.data keys:', Object.keys(data.data));
            throw new Error('Unable to extract merchant ID or token from response. See console for details.');
        }

        // Save to localStorage
        localStorage.setItem('merchantId', merchantId);
        localStorage.setItem('authToken', token);

        // Redirect to dashboard
        window.location.href = 'Dashboard.html';   // adjust path if needed
    } catch (err) {
        errorMsg.textContent = err.message;
        console.error(err);
    }
});