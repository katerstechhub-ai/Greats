document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('errorMessage');

    function validateAndShowError() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === '' || password === '') {
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
            // Optional: you can add further login simulation here
        }
    }

    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();   // prevent any default form submission
        validateAndShowError();
    });
});