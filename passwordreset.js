document.addEventListener('DOMContentLoaded', () => {

    const forgotBtn = document.getElementById('forgotBtn');
    const emailInput = document.getElementById('email');
    const errorDiv = document.getElementById('errorMessage');

    forgotBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (email === '') {
            errorDiv.textContent = 'No account found with that email.';
            errorDiv.classList.remove('hidden');
            errorDiv.classList.remove('bg-green-700');
            errorDiv.classList.add('bg-red-800');
            return;
        }

        errorDiv.classList.remove('hidden');
        errorDiv.classList.remove('bg-red-800');
        errorDiv.classList.add('bg-green-700');
        errorDiv.textContent = 'If an account exists for ' + email + ', you will receive reset instructions shortly.';
        emailInput.value = '';
    });

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