// Function to handle the form submission
async function handleSignUpFormSubmission(event) {
    event.preventDefault(); // Prevent default form submission
  
    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confPassword = document.getElementById('confPassword').value;
    const errorMessage = document.getElementById('error-message');
  
    errorMessage.textContent = '';
  
    // if (password !== confPassword) {
    //   errorMessage.textContent = 'Passwords do not match.';
    //   return;
    // }
  
    try {
      const response = await fetch('/auth/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confPassword }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      else
      {
        window.location.href = '/login'
      }
  
  
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  }
  
  // Function to initialize event listener when the page loads
  function initSignUpForm() {
    document.getElementById('signUpForm').addEventListener('submit', handleSignUpFormSubmission);
  }
  
  // Add event listener for when the page is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initSignUpForm();
  })
  