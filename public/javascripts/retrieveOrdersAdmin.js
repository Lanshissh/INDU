const fetchOrders = async () => {
    // Get customer ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get('customerId');

    if (!customerId) {
        document.getElementById('error-message').textContent = 'Customer ID is missing.';
        return;
    }

    try {
        const response = await fetch(`/customers/orders/${customerId}`);

        if (!response.ok) {
            if (response.status === 403) {
                // If user is not logged in, redirect to the login page
                window.location.href = '/admin';
                return;
            }
            throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        console.log(data);
        displayOrders(data);
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
}

const displayOrders = (orders) => {
    const ordersContainer = document.getElementById('cart-items-container');
    ordersContainer.innerHTML = ''; 

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<tr><td colspan="3">No orders found.</td></tr>'; // Update to show message in table
        return;
    }

    orders.forEach(order => {
        // Add a row for order details at the top
        const orderDetailsRow = document.createElement('tr');
        orderDetailsRow.innerHTML = `
            <td colspan="3">
                <h4>Order Date: ${new Date(order.orderDate).toLocaleDateString()}</h4>
                <p>Status: ${order.status}</p>
                <h5>Total Price: ₱${order.totalPrice.toFixed(2)}</h5>
            </td>
        `;
        ordersContainer.appendChild(orderDetailsRow);

        order.items.forEach(item => {
            const orderRow = document.createElement('tr');
            orderRow.innerHTML = `
                <td>
                    <img src="${item.productImg}" alt="${item.productName}" style="width: 50px; height: 50px;">
                    <strong>${item.productName}</strong>
                </td>
                <td>₱${item.productPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
            `;
            ordersContainer.appendChild(orderRow); 
        });

        // Add a divider row after the items of each order
        const dividerRow = document.createElement('tr');
        dividerRow.innerHTML = `<td colspan="3" style="border-bottom: 2px solid #ccc;"></td>`; // You can customize the style as needed
        ordersContainer.appendChild(dividerRow);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchOrders(); // Fetch orders when the page loads
});
