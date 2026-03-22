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



document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('emailInput');
    const signupBtn = document.getElementById('signupBtn');
    const newsletterForm = document.getElementById('newsletterForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    signupBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent any default action

        const email = emailInput.value.trim();

        // Hide previous messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        // Validation
        if (email === '') {
            errorMessage.textContent = 'Email cannot be empty.';
            errorMessage.classList.remove('hidden');
        } else if (!emailRegex.test(email)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            errorMessage.classList.remove('hidden');
        } else {
            // Valid email: hide form, show success message
            successMessage.classList.remove('hidden');
        }
    });
});