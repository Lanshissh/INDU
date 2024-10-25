

// Fetch all products and display them with delete and update buttons
async function fetchProducts() {
    try {
        const response = await fetch('/api/products/');
        const products = await response.json();

        const productsContainer = document.querySelector('.row.grid.prods');

        products.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.classList.add('col-lg-4', 'col-md-4', 'all');

            productElement.innerHTML = `
                <div class="product-item">
                    <img src="${product.imageUrl}" alt="${product.productName}">
                    <div class="down-content">
                        <h4>${product.productName}</h4>
                        <h6>$${product.productPrice}</h6>
                        <p>${product.productDesc}</p>
                        <button class="btn btn-danger" onclick="deleteProduct('${product.productId}')">Delete</button>
                        <button class="btn btn-primary" onclick="updateProduct('${product.productId}')">Update</button>
                    </div>
                </div>
            `;

            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Delete product function
async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Deleted successfully.')
            location.reload(); // Refresh the page to update the product list
        } else {
            alert('Failed to delete product.');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Redirect to update product page
function updateProduct(productId) {
    console.log(`productID ${productId}`);
    window.location.href = `/updateProduct?id=${productId}`;

}

// Call fetchProducts to load the products when the page is loaded
fetchProducts();
