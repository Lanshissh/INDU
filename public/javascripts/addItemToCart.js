const addItemToCart = () => 
{
    const addToCartBtn = document.querySelector('.add-to-cart-btn').addEventListener('click', async () => 
    {
        // Retrieve product details from view page
        const productName = document.querySelector('.product-name').innerText;
        const productPrice = document.querySelector('.product-price').innerText;
        const productDesc = document.querySelector('.product-desc').innerText;
        const productImg = document.querySelector('.product-img').src; 
        const quantity = document.getElementById('quantity').value;

        // Convert into object
        const cartItem = {
            productName,
            productPrice,
            productDesc,
            productImg,
            quantity
        };

        console.log(cartItem);

        try {
            const response = await fetch('api/cart/createItem', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            });
    
            if (response.ok) 
            {
                const result = await response.json();
                console.log('Cart item added:', result);
                window.location.href = '/cart'
            } 
            else if (response.status === 403) //Sent if the sessionID is non-existent!
            {
    
                window.location.href = '/login'; // Redirect to login page if user is not logged in
            } 
            else 
            {
                console.error('Error adding item to cart:', response.statusText);
            }
        } 
        catch (error) 
        {
            console.log('Error encountered:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addItemToCart();
});
