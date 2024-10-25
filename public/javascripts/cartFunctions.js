//fetch cart items from the endpoint
async function fetchCartItems() 
{
    try 
    {
        const response = await fetch('/api/cart/');


        if (!response.ok) 
        {
            if (response.status === 403) 
            {
                // If user is not logged in, redirect to the login page
                window.location.href = '/login';
                return;
            }
            throw new Error('Failed to fetch cart items');
        }

        const { cartItems } = await response.json(); 
        console.log(cartItems); 

        // if (!Array.isArray(cartItems)) 
        // {
        //     console.error('cartItems is not an array:', cartItems);
        //     return; // Stop execution if not an array
        // }

        displayCartItems(cartItems); // No need to pass totalPrice, we'll recalculate dynamically
        updateTotalPrice(cartItems); // Calculate and display total price initially
    } 
    catch (error) 
    {
        console.error('Error fetching cart items:', error);
    }
}

//render cart items to the cart.html page
function displayCartItems(cartItems) 
{
    const container = document.getElementById('cart-items-container');
    container.innerHTML = ''; // Clear the container

    cartItems.forEach(item => 
    {
        // Create a row for each cart item
        const itemRow = document.createElement('tr');
        itemRow.innerHTML = `
            <td>
                <h3>${item.productName}</h3>
                <img src="${item.productImg}" alt="${item.productName}" style="width: 100px;" />
            </td>
            <td>₱${item.productPrice.toFixed(2)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-item-id="${item.id}" />
                <button class="delete-item" data-item-id="${item.id}">Delete</button>
            </td>
        `;
        container.appendChild(itemRow); // Append item to the container
    });

    // Add event listeners to quantity inputs to update total price dynamically
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const itemId = event.target.getAttribute('data-item-id');
            const newQuantity = parseInt(event.target.value, 10);
            updateCartItemQuantity(itemId, newQuantity, cartItems); // Update the quantity
        });
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = event.target.getAttribute('data-item-id');
            deleteCartItem(itemId, cartItems); // Call delete function
        });
    });
}

// Function to update total price dynamically
function updateTotalPrice(cartItems) {
    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.productPrice * item.quantity;
    }, 0);

    // Display the updated total price
    document.getElementById('total-price').innerHTML = `
        ₱${totalPrice.toFixed(2)}
    `;
}

// Function to update cart item quantity and recalculate total price
function updateCartItemQuantity(itemId, newQuantity, cartItems) {
    // Find the item in the cartItems array and update its quantity
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;

        // Recalculate and update the total price
        updateTotalPrice(cartItems);

        // Optionally, you can send the updated quantity to the server for persistent changes
        updateCartItemOnServer(itemId, newQuantity);
    }
}

// Function to update cart item on the server
async function updateCartItemOnServer(itemId, newQuantity) {
    try {
        const response = await fetch(`/api/cart/updateQuantity/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            console.log('Quantity updated successfully');
        } else {
            console.error('Failed to update quantity on the server');
        }
    } catch (error) {
        console.error('Error updating quantity on the server:', error);
    }
}

// Function to delete cart item on the server
async function deleteCartItem(itemId, cartItems) {
    try {
        const response = await fetch(`/api/cart/deleteItem/${itemId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Item deleted successfully');

            // Remove the item from the cartItems array
            const updatedCartItems = cartItems.filter(item => item.id !== itemId);

            // Re-render the cart with the updated items
            displayCartItems(updatedCartItems);
            updateTotalPrice(updatedCartItems);
        } else {
            console.error('Failed to delete item on the server');
        }
    } catch (error) {
        console.error('Error deleting item on the server:', error);
    }
}

// Checkout function
const cartCheckout = async () => {
    const checkoutBtn = document.querySelector('#checkout-btn');
    
    checkoutBtn.addEventListener('click', async () => {
        try {
            // Send the checkout request to the backend
            const response = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Handle the response from the server
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

    
            // alert('Checkout successful!');
            // redirect the user after successful checkout
            window.location.href = '/orders';

        } 
        catch (error) 
        {
            
            console.error('Error during checkout:', error);
            alert(`Error: ${error.message}`);
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
    cartCheckout();
});
