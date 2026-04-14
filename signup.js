// const API_BASE = 'http://ecommerce.reworkstaging.name.ng/v2';
// const merchantId = '69c2565d1595cbe8104544cb';

// document.addEventListener('DOMContentLoaded', () => {
//     const signupBtn = document.getElementById('signupBtn');
//     const fullNameInput = document.getElementById('fullName');
//     const emailInput = document.getElementById('email');
//     const passwordInput = document.getElementById('password');
//     const phoneInput = document.getElementById('phone');

//     const fullNameError = document.getElementById('fullNameError');
//     const emailError = document.getElementById('emailError');
//     const passwordError = document.getElementById('passwordError');
//     const phoneError = document.getElementById('phoneError');

//     if (signupBtn) {
//         signupBtn.addEventListener('click', async (event) => {
//             event.preventDefault();

//             fullNameError.classList.add('hidden');
//             emailError.classList.add('hidden');
//             passwordError.classList.add('hidden');
//             phoneError.classList.add('hidden');

//             let hasError = false;

//             if (fullNameInput.value.trim() === '') {
//                 fullNameError.classList.remove('hidden');
//                 hasError = true;
//             }
//             if (emailInput.value.trim() === '') {
//                 emailError.classList.remove('hidden');
//                 hasError = true;
//             }
//             if (passwordInput.value.trim() === '') {
//                 passwordError.classList.remove('hidden');
//                 hasError = true;
//             }
//             if (phoneInput.value.trim() === '') {
//                 phoneError.classList.remove('hidden');
//                 hasError = true;
//             }

//             if (hasError) return;

//             const nameParts = fullNameInput.value.trim().split(' ');
//             const firstName = nameParts[0] || '';
//             const lastName = nameParts.slice(1).join(' ') || firstName;

//             const payload = {
//                 first_name: firstName,
//                 last_name: lastName,
//                 email: emailInput.value.trim(),
//                 phone: phoneInput.value.trim(),
//                 password: passwordInput.value,
//                 merchant_id: merchantId
//             };

//             try {
//                 const response = await fetch(`${API_BASE}/users`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload)
//                 });

//                 const text = await response.text();
//                 let parsed;
//                 try { parsed = JSON.parse(text); } catch (e) { parsed = text; }

//                 console.log('Signup response:', parsed);

//                 if (response.ok) {
//                     const user = parsed.data || parsed.user || parsed;
//                     localStorage.setItem('customerId', user.id || '');
//                     localStorage.setItem('customerName', (user.first_name || firstName) + ' ' + (user.last_name || lastName));
//                     localStorage.setItem('customerEmail', user.email || emailInput.value.trim());
//                     window.location.href = './login.html';
//                 } else {
//                     const msg = parsed.msg || parsed.message || 'Sign up failed. Please try again.';
//                     fullNameError.textContent = msg;
//                     fullNameError.classList.remove('hidden');
//                 }

//             } catch (err) {
//                 console.error('Signup error:', err);
//                 fullNameError.textContent = 'Something went wrong. Please try again.';
//                 fullNameError.classList.remove('hidden');
//             }
//         });
//     }

//     // ========== Newsletter Button ==========
//     const signupBtn2 = document.getElementById('signupBtn2');
//     const emailInput2 = document.getElementById('emailInput');
//     const successMessage = document.getElementById('successMessage');
//     const errorMessage2 = document.getElementById('errorMessage2');
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (signupBtn2) {
//         signupBtn2.addEventListener('click', function (e) {
//             e.preventDefault();
//             const email = emailInput2.value.trim();
//             errorMessage2.classList.add('hidden');
//             successMessage.classList.add('hidden');
//             if (email === '') {
//                 errorMessage2.textContent = 'Email cannot be empty.';
//                 errorMessage2.classList.remove('hidden');
//             } else if (!emailRegex.test(email)) {
//                 errorMessage2.textContent = 'Please enter a valid email address.';
//                 errorMessage2.classList.remove('hidden');
//             } else {
//                 successMessage.classList.remove('hidden');
//             }
//         });
//     }
// });



const API_BASE = '/api';
const merchantId = '69c2565d1595cbe8104544cb';

document.addEventListener('DOMContentLoaded', () => {

    const signupBtn = document.getElementById('signupBtn');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');

    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const phoneError = document.getElementById('phoneError');

    if (signupBtn) {
        signupBtn.addEventListener('click', async (event) => {
            event.preventDefault();

            fullNameError.classList.add('hidden');
            emailError.classList.add('hidden');
            passwordError.classList.add('hidden');
            phoneError.classList.add('hidden');

            let hasError = false;

            if (fullNameInput.value.trim() === '') {
                fullNameError.classList.remove('hidden');
                hasError = true;
            }
            if (emailInput.value.trim() === '') {
                emailError.classList.remove('hidden');
                hasError = true;
            }
            if (passwordInput.value.trim() === '') {
                passwordError.classList.remove('hidden');
                hasError = true;
            }
            if (phoneInput.value.trim() === '') {
                phoneError.classList.remove('hidden');
                hasError = true;
            }

            if (hasError) return;

            const nameParts = fullNameInput.value.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || firstName;

            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                password: passwordInput.value,
                merchant_id: merchantId
            };

            try {
                const response = await fetch(`${API_BASE}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const text = await response.text();
                let parsed;
                try { parsed = JSON.parse(text); } catch (e) { parsed = {}; }

                console.log('Signup response:', parsed);

                if (parsed.msg === 'user already exist' || parsed.type === 'INVALID_CREDENTIAL' || parsed.code === 404) {
                    const msg = parsed.msg || 'Sign up failed. Please try again.';
                    fullNameError.textContent = msg;
                    fullNameError.classList.remove('hidden');
                    return;
                }

                // API returns user directly — no nested wrapper
                localStorage.setItem('customerId', parsed.id || '');
                localStorage.setItem('customerName', (parsed.first_name || firstName) + ' ' + (parsed.last_name || lastName));
                localStorage.setItem('customerEmail', parsed.email || emailInput.value.trim());
                window.location.href = './login.html';

            } catch (err) {
                console.error('Signup error:', err);
                fullNameError.textContent = 'Something went wrong. Please try again.';
                fullNameError.classList.remove('hidden');
            }
        });
    }

    // ========== Newsletter Button ==========
    const signupBtn2 = document.getElementById('signupBtn2');
    const emailInput2 = document.getElementById('emailInput');
    const successMessage = document.getElementById('successMessage');
    const errorMessage2 = document.getElementById('errorMessage2');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (signupBtn2) {
        signupBtn2.addEventListener('click', function (e) {
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