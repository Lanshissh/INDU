

const fetchProductsByCategory = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('categoryId');
        console.log(categoryId)
        const res = await fetch(`/api/categories/${categoryId}`); // Adjust the API endpoint
        const filteredProducts = await res.json();
        console.log(filteredProducts);

        const productsContainer = document.querySelector('.row.grid');

        filteredProducts.forEach(product => {
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

            productsContainer.appendChild(productCard); // Append the product card to the container
        });

        redirectToProductSpotlight();

    } catch (error) {
        console.log('Encountered an error in fetching products for the category', error);
    }
};

// Function to redirect user to product spotlight page
const redirectToProductSpotlight = () => {
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
    fetchProductsByCategory();
})
