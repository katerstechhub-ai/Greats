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