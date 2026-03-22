document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signupBtn');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    function validateAndShowErrors() {
        let hasError = false;

        // Reset all errors (hide them)
        fullNameError.classList.add('hidden');
        emailError.classList.add('hidden');
        passwordError.classList.add('hidden');

        // Check each field
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

        // If no errors, you can proceed with signup (e.g., send data)
        if (!hasError) {
            console.log('Form is valid – proceed with signup');
            // Here you would typically submit the form or call an API
        }
    }

    signupBtn.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent any default form submission
        validateAndShowErrors();
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