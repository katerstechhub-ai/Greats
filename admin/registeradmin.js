const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';

const form = document.getElementById('registerForm');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    successMsg.textContent = '';

    // Gather form data
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
        // IMPORTANT: phones array must contain at least one number
        phones: phoneValue ? [parseInt(phoneValue)] : [1234567890]   // fallback if empty
    };

    try {
        const response = await fetch(`${API_BASE}/merchants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('Registration raw response:', responseText);

        if (!response.ok) {
            let errorMessage;
            try {
                const errData = JSON.parse(responseText);
                errorMessage = errData.msg || errData.message || 'Registration failed';
            } catch {
                errorMessage = HTTP `${response.status}: ${responseText}`;
            }
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        console.log('Registration success:', data);
        successMsg.textContent = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
            window.location.href = 'loginadmin.html';   // adjust path if needed
        }, 2000);
    } catch (err) {
        errorMsg.textContent = err.message;
        console.error(err);
    }
});