document.addEventListener('DOMContentLoaded', () => {
    const forgotBtn = document.getElementById('forgotBtn');
    const emailInput = document.getElementById('email');
    const errorDiv = document.getElementById('errorMessage');

    function validateAndShowError() {
        const email = emailInput.value.trim();

        if (email === '') {
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
            // Here you would typically send a reset email.
            // For demo, we just hide the error and do nothing.
        }
    }

    forgotBtn.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent any default form submission
        validateAndShowError();
    });
});