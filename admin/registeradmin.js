const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        successMsg.textContent = '';

        const phoneValue = document.getElementById('phone').value.trim();
        const payload = {
            first_name: document.getElementById('firstName').value.trim(),
            last_name: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: phoneValue,
            store_name: document.getElementById('storeName').value.trim(),
            password: document.getElementById('password').value,
            descp: document.getElementById('description').value.trim() || '',
            icon: '',
            banner: '',
            phones: [parseInt(phoneValue)] || [1234567890]
        };

        try {
            const response = await fetch(`${API_BASE}/merchants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            let parsed;
            try { parsed = JSON.parse(text); } catch (e) { parsed = text; }

            console.log('Registration response:', parsed);

            if (response.ok) {
                successMsg.textContent = 'Registration successful! Redirecting to login...';
                setTimeout(() => {
                    window.location.href = 'loginadmin.html';
                }, 2000);
            } else {
                const msg = parsed.msg || parsed.message || 'Registration failed';
                throw new Error(msg);
            }
        } catch (err) {
            errorMsg.textContent = err.message;
            console.error(err);
        }
    });
});