document.addEventListener('DOMContentLoaded', function () {
    // Select the grid container to display the customers
    const productsGrid = document.querySelector('.row.grid');

    // Function to fetch all customers
    async function fetchCustomers() {
        try {
            const response = await fetch('/customers'); // Adjust the URL if necessary
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }

            const customers = await response.json();
            populateProductsGrid(customers);
        } 
        catch (error) 
        {
            console.error('Error fetching customers:', error);
            alert('Unauthorized Access.');
            window.location.href = '/adminlogin'
        }
    }

    // Function to populate the products grid with customer data
    function populateProductsGrid(customers) {
        productsGrid.innerHTML = ''; // Clear the grid

        customers.forEach(customer => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-item', 'col-lg-4', 'col-md-6', 'col-sm-12'); // Bootstrap classes for layout

            // Create content for the customer card
            productCard.innerHTML = `
                <div class="product">
                    <div class="product-content">
                        <h4>${customer.username}</h4>
                        <p>Email: ${customer.email}</p>
                        <button class="btn btn-primary view-orders-btn" data-customer-id="${customer.id}">View Orders</button>
                    </div>
                </div>
            `;

            productsGrid.appendChild(productCard); // Add the card to the grid
        });

        // Attach event listeners to the View Orders buttons
        attachViewOrdersListeners();
    }

    // Function to attach event listeners to View Orders buttons
    function attachViewOrdersListeners() {
        const viewOrderButtons = document.querySelectorAll('.view-orders-btn');
        viewOrderButtons.forEach(button => {
            button.addEventListener('click', function () {
                const customerId = this.getAttribute('data-customer-id'); // Get the customer ID from data attribute
                
                // Redirect to the route with the customer ID
                window.location.href = `/ViewUserOrders?customerId=${customerId}`;
            });
        });
    }

    // Initial fetch for customers when the page loads
    fetchCustomers();
});
