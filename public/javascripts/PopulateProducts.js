//function to populate products page with products from the /api/products endpoint
const fetchProducts = async () => {
    try 
    {
        const res = await fetch('/api/products');
        const products = await res.json();
        console.log(products);

        const productsContainer = document.querySelector('.row.grid'); 

        products.forEach(product => {
            const productCard = document.createElement('div'); 
            productCard.className = 'col-lg-4 col-md-4 all des'; 
            productCard.setAttribute('data-id', product.productId); 

            productCard.innerHTML = `
                <div class="product-item">
                    <a><img src="${product.imageUrl}" alt=""></a>
                    <div class="down-content">
                        <a><h4>${product.productName}</h4></a>
                        <h6>${product.productPrice}</h6>
                    </div>
                </div>
            `;

            productsContainer.appendChild(productCard); // Append the product card to the containera

          
        });

        redirectToProductSpotlight();

    } 
    catch (error) 
    {
        console.log('Encountered an error in fetching all products', error);
    }
}

//function to redirect user to product spotlight page
const redirectToProductSpotlight = () => 
{
    const productCards = document.querySelectorAll('.product-item');

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.closest('.col-lg-4').getAttribute('data-id'); 
            console.log(productId);
            window.location.href = `/view?id=${productId}`; 
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    
});
