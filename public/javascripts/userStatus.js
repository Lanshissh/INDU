const checkUserStatus = async () => {
    const statusItem = document.querySelector('.nav-item.status');

    try {
        const response = await fetch('/auth/checkUserStatus'); //call the endpoint to retrieve user status

        if (response.ok) {
            const data = await response.json();

            if (data.isLoggedIn) {
                // Create the logout link and add an event listener
                const logoutLink = document.createElement('a');
                logoutLink.className = 'nav-link';
                logoutLink.href = '#'; 
                logoutLink.innerText = 'Logout';

                logoutLink.addEventListener('click', async (event) => {
                    event.preventDefault(); 
                    await logoutUser(); 
                });

                statusItem.innerHTML = ''; 
                statusItem.appendChild(logoutLink); 
            } else {
                statusItem.innerHTML = '<a class="nav-link" href="/login">Login</a>';
            }
        } else {
            console.error('Error fetching user status:', response.statusText);
            statusItem.innerHTML = '<a class="nav-link" href="/login">Login</a>';
        }
    } catch (error) {
        console.error('Error:', error);
        statusItem.innerHTML = '<a class="nav-link" href="/login">Login</a>';
    }
};

const logoutUser = async () => {
    try {
        const response = await fetch('/auth/logout', { //call this endpoint to logout user
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        if (response.ok) {
           
            window.location.href = '/login'; 
        } else {
            console.error('Error logging out:', response.statusText);
            // Optionally show an error message to the user
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally show an error message to the user
    }
};

document.addEventListener('DOMContentLoaded', checkUserStatus);
