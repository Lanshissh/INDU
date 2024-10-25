document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMessageDiv = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = {
            username: form.username.value,
            password: form.password.value
        };

        try {
            const response = await fetch('/adminAuth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Redirect to homepage on successful login
                // window.location.href = '/';
                window.location.href = '/admin'
            } else {
                // Display error message if credentials are invalid
                const errorData = await response.json();
                errorMessageDiv.textContent = errorData.error; // Display server's error message
                errorMessageDiv.style.display = 'block'; // Show the error message
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
            errorMessageDiv.style.display = 'block';
        }
    });
});